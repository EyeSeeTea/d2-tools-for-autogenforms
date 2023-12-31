//
import * as React from "react";
import { ErrorAndWarningDialog } from "./ErrorAndWarningDialog.component";
import { ErrorDialog } from "./ErrorDialog.component";
import { WarningDialog } from "./WarningDialog.component";

import { validationStrategies } from "../../../../metaData/RenderFoundation/renderFoundation.const";

function isSaveAllowedWithErrors(isCompleting, validationStrategy) {
    if (validationStrategy === validationStrategies.NONE) {
        return true;
    }

    if (validationStrategy === validationStrategies.ON_COMPLETE) {
        return !isCompleting;
    }

    return false;
}

export const MessagesDialogContents = props => {
    const { open, warnings, errors, isCompleting, validationStrategy, ...passOnProps } = props;
    if (!open) {
        return null;
    }

    if (warnings && warnings.length > 0 && errors && errors.length > 0) {
        return (
            // $FlowFixMe[cannot-spread-inexact] automated comment
            <ErrorAndWarningDialog
                errors={errors}
                warnings={warnings}
                saveEnabled={isSaveAllowedWithErrors(isCompleting, validationStrategy)}
                {...passOnProps}
            />
        );
    }

    if (errors && errors.length > 0) {
        return (
            // $FlowFixMe
            <ErrorDialog
                errors={errors}
                saveEnabled={isSaveAllowedWithErrors(isCompleting, validationStrategy)}
                {...passOnProps}
            />
        );
    }

    return (
        // $FlowFixMe
        <WarningDialog warnings={warnings} {...passOnProps} />
    );
};
