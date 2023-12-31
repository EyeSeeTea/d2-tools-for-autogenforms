//
// $FlowFixMe
import { useSelector, shallowEqual } from "react-redux";

const useList = storeId => {
    const listState = useSelector(
        ({ workingLists, workingListsListRecords, workingListsColumnsOrder }) => ({
            eventRecords: workingListsListRecords[storeId],
            recordsOrder: workingLists[storeId] && workingLists[storeId].order,
            customColumnOrder: workingListsColumnsOrder[storeId],
        }),
        shallowEqual
    );

    return {
        ...listState,
    };
};

export const useWorkingListsCommonStateManagementOffline = storeId => useList(storeId);
