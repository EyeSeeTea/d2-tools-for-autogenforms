//
import React, { useCallback } from "react";
import { useConfig } from "@dhis2/app-runtime";
import { buildUrl } from "capture-core-utils";
import { systemSettingsStore } from "../../../../../../metaDataMemoryStores";

export const TrackedEntityInstance = ({ name, id, orgUnitId, linkProgramId }) => {
    const { baseUrl } = useConfig();
    const getUrl = useCallback(() => {
        const trackerBaseUrl = buildUrl(
            baseUrl,
            systemSettingsStore.get().trackerAppRelativePath,
            "/#/dashboard?"
        );
        const baseParams = `tei=${id}&ou=${orgUnitId}`;
        const params = linkProgramId ? `${baseParams}&program=${linkProgramId}` : baseParams;
        return trackerBaseUrl + params;
    }, [baseUrl, id, orgUnitId, linkProgramId]);

    return (
        <a href={getUrl()} target="_blank" rel="noopener noreferrer">
            {name}
        </a>
    );
};
