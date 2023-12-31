//
import React, { Component } from "react";
import i18n from "@dhis2/d2-i18n";
import { withStyles } from "@material-ui/core/styles";
import { IconChevronLeft24 } from "@dhis2/ui";
import { EventDetails } from "../EventDetailsSection/EventDetailsSection.container";
import { Button } from "../../../Buttons/Button.component";
import { RightColumnWrapper } from "../RightColumn/RightColumnWrapper.component";

const getStyles = theme => ({
    container: {
        padding: theme.typography.pxToRem(24),
        paddingTop: theme.typography.pxToRem(10),
    },
    dataEntryPaper: {
        marginBottom: theme.typography.pxToRem(10),
        padding: theme.typography.pxToRem(10),
    },
    showAllEvents: {
        paddingLeft: 8,
        marginBottom: 10,
        textTransform: "none",
        backgroundColor: "#E9EEF4",
        boxShadow: "none",
        color: "#494949",
        fontSize: 14,
        fontWeight: "normal",
    },
    header: {
        ...theme.typography.title,
        fontSize: 18,
        padding: theme.typography.pxToRem(10),
        borderBottom: `1px solid ${theme.palette.grey.blueGrey}`,
    },
    contentContainer: {
        display: "flex",
        flexWrap: "wrap",
    },
});

class ViewEventPlain extends Component {
    handleGoBackToAllEvents = () => {
        this.props.onBackToAllEvents();
    };

    render() {
        const { classes, programStage, currentDataEntryKey, eventAccess } = this.props;
        return (
            <div className={classes.container}>
                <Button
                    className={classes.showAllEvents}
                    variant="raised"
                    onClick={this.handleGoBackToAllEvents}
                >
                    <IconChevronLeft24 />
                    {i18n.t("Show all events")}
                </Button>
                <div className={classes.contentContainer}>
                    <EventDetails eventAccess={eventAccess} programStage={programStage} />
                    <RightColumnWrapper
                        eventAccess={eventAccess}
                        programStage={programStage}
                        dataEntryKey={currentDataEntryKey}
                    />
                </div>
            </div>
        );
    }
}

export const ViewEventComponent = withStyles(getStyles)(ViewEventPlain);
