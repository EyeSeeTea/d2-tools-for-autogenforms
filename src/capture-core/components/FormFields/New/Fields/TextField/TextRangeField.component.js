//
import * as React from "react";
import { withStyles, withTheme } from "@material-ui/core/styles";
import { TextRangeField as UITextRangeField } from "capture-ui";

const getStyles = theme => ({
    inputWrapperFocused: {
        border: `2px solid ${theme.palette.primary.light}`,
        borderRadius: "5px",
    },
    inputWrapperUnfocused: {
        padding: 2,
    },
    innerInputError: {
        color: theme.palette.error.main,
        padding: theme.typography.pxToRem(3),
        fontSize: theme.typography.pxToRem(12),
    },
    innerInputWarning: {
        color: theme.palette.warning.dark,
        padding: theme.typography.pxToRem(3),
        fontSize: theme.typography.pxToRem(12),
    },
    innerInputInfo: {
        color: "green",
        padding: theme.typography.pxToRem(3),
        fontSize: theme.typography.pxToRem(12),
    },
    innerInputValidating: {
        color: "orange",
        padding: theme.typography.pxToRem(3),
        fontSize: theme.typography.pxToRem(12),
    },
});

const TextRangeFieldPlain = props => {
    const { ...passOnProps } = props;
    return <UITextRangeField {...passOnProps} />;
};

export const TextRangeField = withTheme()(withStyles(getStyles)(TextRangeFieldPlain));
