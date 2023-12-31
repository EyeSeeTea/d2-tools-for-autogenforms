//
import { useState, useEffect, useRef } from "react";
import { getAssociatedOrgUnitGroups } from "capture-core/MetaDataStoreUtils/getAssociatedOrgUnitGroups";

export function useOrgUnitGroups(orgUnitId) {
    const lastRequest = useRef({ orgUnitId: undefined, requestId: 0, fetching: false });
    const [orgUnitGroups, setOrgUnitGroups] = useState();
    const [error, setError] = useState();

    let currentRequestId;

    if (orgUnitId && orgUnitId !== lastRequest.current.orgUnitId) {
        currentRequestId = lastRequest.current.requestId + 1;
        lastRequest.current = {
            orgUnitId,
            requestId: currentRequestId,
            fetching: true,
        };
    }

    useEffect(() => {
        if (!orgUnitId || currentRequestId !== lastRequest.current.requestId) {
            return;
        }

        setError(undefined);
        getAssociatedOrgUnitGroups(orgUnitId)
            .then(response => {
                if (currentRequestId === lastRequest.current.requestId) {
                    lastRequest.current.fetching = false;
                    setOrgUnitGroups(response);
                }
            })
            .catch(setError);
    }, [orgUnitId, currentRequestId]);

    return lastRequest.current.fetching ? { error } : { orgUnitGroups, error };
}
