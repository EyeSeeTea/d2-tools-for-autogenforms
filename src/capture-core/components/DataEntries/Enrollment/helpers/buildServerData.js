//
import { pipe } from "capture-core-utils";

import { convertValue as convertFormToClient } from "../../../../converters/formToClient";
import { convertValue as convertClientToServer } from "../../../../converters/clientToServer";

function getFormServerValues(formValues, formFoundation) {
    const formServerValues = formFoundation.convertValues(
        formValues,
        pipe(convertFormToClient, convertClientToServer)
    );
    return formServerValues;
}

function getTEIServerData(enrollment, selections, formServerValues) {
    const trackedEntityType = enrollment.trackedEntityType.id;
    return {
        orgUnit: selections.orgUnitId,
        trackedEntityType,
        // $FlowFixMe
        attributes: Object.keys(formServerValues).map(key => ({
            attribute: key,
            value: formServerValues[key],
        })),
    };
}

// todo (report lgtm) this function is used. when its used 6 elements are being passed in but here the last four are not being used.
export function buildServerData(dataEntryKey, selections, enrollment, formValues = {}) {
    const formFoundation = enrollment.enrollmentForm;
    const formServerValues = getFormServerValues(formValues, formFoundation);

    const teiServerData = getTEIServerData(enrollment, selections, formServerValues);

    return { ...teiServerData };
}
