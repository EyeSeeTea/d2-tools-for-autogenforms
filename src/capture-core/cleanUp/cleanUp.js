//
import { batchActions } from "redux-batched-actions";
import { cleanUpEventListInLoading } from "./cleanUp.actions";

function getActionToCleanUpInLoadingList(state) {
    if (state.workingListsUI.main && state.workingListsUI.main.isLoading) {
        return cleanUpEventListInLoading();
    }
    return null;
}

export const cleanUpCommon = store => {
    const cleanUpActions = [getActionToCleanUpInLoadingList(store.getState())].filter(value => value);

    if (cleanUpActions.length > 0) {
        store.dispatch(batchActions(cleanUpActions));
    }
};
