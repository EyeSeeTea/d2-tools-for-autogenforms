//
/* eslint-disable complexity */
import * as React from "react";

const typeKeysForProperty = {
    VALIDATING: "validatingMessage",
    ERROR: "errorMessage",
    WARNING: "warningMessage",
    INFO: "infoMessage",
};

const messageKeys = {
    errorMessage: "errorMessage",
    warningMessage: "warningMessage",
    infoMessage: "infoMessage",
    validatingMessage: "validatingMessage",
};

const getCalculateMessagesHOC = (InnerComponent, overrideMessagesPropNames = {}) =>
    class CalculateMessagesHOC extends React.Component {
        static getMessage(errorText, warningText, infoText, validatingText) {
            let message;
            let typeKey;

            if (validatingText) {
                message = validatingText;
                typeKey = typeKeysForProperty.VALIDATING;
            } else if (errorText) {
                message = errorText;
                typeKey = typeKeysForProperty.ERROR;
            } else if (warningText) {
                message = warningText;
                typeKey = typeKeysForProperty.WARNING;
            } else if (infoText) {
                message = infoText;
                typeKey = typeKeysForProperty.INFO;
            }

            return {
                message,
                typeKey,
            };
        }

        static getRulesMessage(
            errorText,
            warningText,
            errorTextOnComplete,
            warningTextOnComplete,
            rulesCompulsoryError,
            touched,
            validationAttempted
        ) {
            let message;
            let typeKey;

            if (errorText) {
                message = errorText;
                typeKey = typeKeysForProperty.ERROR;
            } else if (errorTextOnComplete && validationAttempted) {
                message = errorTextOnComplete;
                typeKey = typeKeysForProperty.ERROR;
            } else if (warningText) {
                message = warningText;
                typeKey = typeKeysForProperty.WARNING;
            } else if (warningTextOnComplete && validationAttempted) {
                message = warningTextOnComplete;
                typeKey = typeKeysForProperty.WARNING;
            } else if (rulesCompulsoryError && (touched || validationAttempted)) {
                message = rulesCompulsoryError;
                typeKey = typeKeysForProperty.ERROR;
            }

            return {
                message,
                typeKey,
            };
        }

        getMessage = messageKey =>
            overrideMessagesPropNames[messageKey]
                ? this.props[overrideMessagesPropNames[messageKey]]
                : this.props[messageKey];

        render() {
            const {
                errorMessage,
                warningMessage,
                infoMessage,
                validatingMessage,
                rulesErrorMessage,
                rulesWarningMessage,
                rulesErrorMessageOnComplete,
                rulesWarningMessageOnComplete,
                rulesCompulsoryError,
                touched,
                validationAttempted,
                ...passOnProps
            } = this.props;

            let messageContainer =
                touched || validationAttempted
                    ? CalculateMessagesHOC.getMessage(
                          this.getMessage(messageKeys.errorMessage),
                          this.getMessage(messageKeys.warningMessage),
                          this.getMessage(messageKeys.infoMessage),
                          this.getMessage(messageKeys.validatingMessage)
                      )
                    : {};

            if (!messageContainer.message) {
                messageContainer = CalculateMessagesHOC.getRulesMessage(
                    rulesErrorMessage,
                    rulesWarningMessage,
                    rulesErrorMessageOnComplete,
                    rulesWarningMessageOnComplete,
                    rulesCompulsoryError,
                    touched,
                    validationAttempted
                );
            }

            const passOnMessage = messageContainer.message
                ? {
                      // $FlowFixMe[invalid-computed-prop] automated comment
                      [messageContainer.typeKey]: messageContainer.message,
                  }
                : null;

            return (
                <div>
                    <InnerComponent {...passOnMessage} {...passOnProps} />
                </div>
            );
        }
    };

export const withCalculateMessages = overrideMessagesPropNames => InnerComponent =>
    getCalculateMessagesHOC(InnerComponent, overrideMessagesPropNames);
