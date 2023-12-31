//
import * as React from "react";
import { withStyles, withTheme } from "@material-ui/core/styles";
import { DateTimeRangeField as UIDateTimeRangeField } from "capture-ui";
import { withCalendarProps } from "../../../HOC/withCalendarProps";

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

class DateTimeRangeFieldPlain extends React.Component {
    render() {
        const { ...passOnProps } = this.props;
        return <UIDateTimeRangeField {...passOnProps} />;
    }
}

export const DateTimeRangeField = withTheme()(
    withCalendarProps()(withStyles(getStyles)(DateTimeRangeFieldPlain))
);
