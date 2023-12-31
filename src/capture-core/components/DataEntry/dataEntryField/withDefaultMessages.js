//
import * as React from "react";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";

const styles = theme => ({
    base: {
        paddingTop: 10,
    },
    error: {
        color: theme.palette.error.main,
        fontSize: theme.typography.pxToRem(12),
    },
});

const getFieldMessages = InnerComponent =>
    class FieldMessages extends React.Component {
        static createMessageElement(text, classes) {
            return <div className={classes}>{text}</div>;
        }

        static getMessageElement(validationError, classes) {
            let messageElement;

            if (validationError) {
                messageElement = FieldMessages.createMessageElement(
                    validationError,
                    classNames(classes.error, classes.base)
                );
            }

            return messageElement;
        }

        render() {
            const { classes, validationError, touched, validationAttempted, ...passOnProps } = this.props;
            const messageElement =
                touched || validationAttempted
                    ? FieldMessages.getMessageElement(validationError, classes)
                    : null;

            return (
                <div>
                    <InnerComponent {...passOnProps} />
                    {messageElement}
                </div>
            );
        }
    };

export const withDefaultMessages = () => InnerComponent =>
    withStyles(styles)(getFieldMessages(InnerComponent));
