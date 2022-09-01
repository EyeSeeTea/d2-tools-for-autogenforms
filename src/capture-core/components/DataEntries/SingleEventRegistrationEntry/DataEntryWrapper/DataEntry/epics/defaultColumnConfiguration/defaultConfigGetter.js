//
import i18n from "@dhis2/d2-i18n";
import { dataElementTypes as elementTypeKeys } from "../../../../../../../metaData";

import { mainPropertyNames } from "../../../../../../../events/mainPropertyNames.const";

export const getDefaultMainConfig = stage => {
    const baseFields = [
        {
            id: mainPropertyNames.OCCURRED_AT,
            visible: true,
            isMainProperty: true,
            type: elementTypeKeys.DATE,
        },
        {
            id: mainPropertyNames.EVENT_STATUS,
            header: "Status",
            visible: true,
            isMainProperty: true,
            type: elementTypeKeys.TEXT,
            singleSelect: true,
            options: [
                { text: i18n.t("Active"), value: "ACTIVE" },
                { text: i18n.t("Completed"), value: "COMPLETED" },
            ],
        },
    ];

    const extraFields = [];
    if (stage.enableUserAssignment) {
        const assigneeField = {
            id: mainPropertyNames.ASSIGNEE,
            type: "ASSIGNEE",
            apiName: "assignedUser",
            header: "Assigned to",
            visible: true,
            isMainProperty: true,
        };
        extraFields.push(assigneeField);
    }

    return [...baseFields, ...extraFields];
};

export const getMetaDataConfig = stage =>
    stage.getElements().map(element => ({
        id: element.id,
        visible: element.displayInReports,
    }));
