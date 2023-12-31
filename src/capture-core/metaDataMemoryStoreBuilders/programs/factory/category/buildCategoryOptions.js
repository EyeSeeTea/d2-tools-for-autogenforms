//
/* eslint-disable no-await-in-loop */
import { MemoryAdapter } from "capture-core-utils/storage";
import { getUserStorageController } from "../../../../storageControllers";
import { userStores } from "../../../../storageControllers/stores";

async function getCategoryOptionIds(categoryId) {
    const storageController = getUserStorageController();
    const storeData = await storageController.get(userStores.CATEGORY_OPTIONS_BY_CATEGORY, categoryId);
    return storeData.options;
}

async function getCategoryOptionsThroughCursor(
    categoryId,
    categoryOptionIds,
    { predicate, project, onIsAborted }
) {
    const internalPredicate = categoryOption => {
        const isOptionForCategory = categoryOptionIds[categoryOption.id];
        if (!isOptionForCategory) {
            return false;
        }
        return predicate(categoryOption);
    };

    const storageController = getUserStorageController();
    const mappedOptions = await storageController.getAll(userStores.CATEGORY_OPTIONS, {
        predicate: internalPredicate,
        project,
        onIsAborted,
        onIDBGetRequest: source =>
            source
                .index("categoryId")
                // $FlowFixMe[prop-missing] automated comment
                .openCursor(IDBKeyRange.only(categoryId)),
    });
    return mappedOptions;
}

function getCategoryOptionsFromMemoryAdapterAsync(categoryOptionIds, predicate, project) {
    const storageController = getUserStorageController();
    const optionPromises = categoryOptionIds.map(id =>
        storageController
            .get(userStores.CATEGORY_OPTIONS, id)
            .then(co => (predicate(co) ? project(co) : null))
    );

    return Promise.all(optionPromises).then(options => options.filter(o => o));
}

async function getCategoryOptions(categoryId, categoryOptionIds, callbacks) {
    const { predicate, project } = callbacks;
    if (getUserStorageController().adapterType === MemoryAdapter) {
        return getCategoryOptionsFromMemoryAdapterAsync(categoryOptionIds, predicate, project);
    }
    const mappedOptions = await getCategoryOptionsThroughCursor(categoryId, categoryOptionIds, callbacks);
    return mappedOptions;
}

export async function buildCategoryOptionsAsync(categoryId, callbacks) {
    const categoryOptionIds = await getCategoryOptionIds(categoryId);
    return getCategoryOptions(categoryId, categoryOptionIds, callbacks);
}
