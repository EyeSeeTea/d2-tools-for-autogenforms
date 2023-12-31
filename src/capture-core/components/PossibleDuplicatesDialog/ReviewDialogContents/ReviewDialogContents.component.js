//
import React, { useContext } from "react";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { withStyles } from "@material-ui/core/styles";
import i18n from "@dhis2/d2-i18n";
import { CardList } from "../../CardList";
import { ReviewDialogContentsPager } from "./ReviewDialogContentsPager.container";
import { ResultsPageSizeContext } from "../../Pages/shared-contexts";

const getStyles = theme => ({
    linkButtonContainer: {
        paddingTop: theme.typography.pxToRem(10),
    },
    title: {
        margin: 0,
        paddingLeft: theme.typography.pxToRem(10),
    },
});

const ReviewDialogContentsPlain = ({
    classes,
    dataElements,
    teis,
    selectedScopeId,
    dataEntryId,
    renderCardActions,
}) => {
    const { resultsPageSize } = useContext(ResultsPageSizeContext);
    return (
        <React.Fragment>
            <DialogContent data-test="duplicates-modal">
                <DialogTitle className={classes.title}>{i18n.t("Possible duplicates found")}</DialogTitle>
                <CardList
                    noItemsText={i18n.t("No results found")}
                    items={teis}
                    dataElements={dataElements}
                    renderCustomCardActions={renderCardActions}
                />

                <ReviewDialogContentsPager
                    dataEntryId={dataEntryId}
                    selectedScopeId={selectedScopeId}
                    nextPageButtonDisabled={teis.length < resultsPageSize}
                />
            </DialogContent>
        </React.Fragment>
    );
};

export const ReviewDialogContentsComponent = withStyles(getStyles)(ReviewDialogContentsPlain);
