//

import { dataElementTypes } from "../../../metaData";

const getImageOrFileResourceSubvalue = async (key, querySingleResource) => {
    if (!key) return null;

    const { id, displayName: name } = await querySingleResource({ resource: "fileResources", id: key });
    return {
        id,
        name,
        value: id,
    };
};

const getOrganisationUnitSubvalue = async (key, querySingleResource) => {
    const organisationUnit = await querySingleResource({
        resource: "organisationUnits",
        id: key,
        params: {
            fields: "id,name",
        },
    });
    return { ...organisationUnit };
};

export const subValueGetterByElementType = {
    [dataElementTypes.FILE_RESOURCE]: getImageOrFileResourceSubvalue,
    [dataElementTypes.IMAGE]: getImageOrFileResourceSubvalue,
    [dataElementTypes.ORGANISATION_UNIT]: getOrganisationUnitSubvalue,
};
