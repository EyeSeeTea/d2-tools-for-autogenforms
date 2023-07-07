//
import { connect } from "react-redux";
import { ViewEventDataEntryComponent } from "./ViewEventDataEntry.component";
import { withLoadingIndicator } from "../../../HOC/withLoadingIndicator";

const mapStateToProps = state => {
    const eventDetailsSection = state.viewEventPage.eventDetailsSection || {};
    const eventStatus = state.viewEventPage?.loadedValues?.eventContainer?.event?.status;
    return {
        ready: !state.activePage.isDataEntryLoading && !eventDetailsSection.loading,
        eventStatus,
    };
};

const mapDispatchToProps = () => ({});

// $FlowSuppress
// $FlowFixMe[missing-annot] automated comment
export const ViewEventDataEntry = connect(
    mapStateToProps,
    mapDispatchToProps
)(withLoadingIndicator()(ViewEventDataEntryComponent));
