//
import * as React from "react";
import { connect } from "react-redux";
import { parse } from "query-string";
import { paramsSelector } from "./appSync.selectors";
import { LoadingMaskForPage } from "../LoadingMasks";
import { viewEventFromUrl } from "../Pages/ViewEvent/ViewEventComponent/viewEvent.actions";
import { updateSelectionsFromUrl } from "../LockedSelector";

import { pageFetchesOrgUnitUsingTheOldWay } from "../../utils/url";

export const pageKeys = {
    MAIN: "",
    VIEW_EVENT: "viewEvent",
    SEARCH: "search",
    NEW: "new",
    ENROLLMENT_EVENT_NEW: "enrollmentEventNew",
    ENROLLMENT_EVENT: "enrollmentEventEdit",
};

const programIdParameter = {
    urlParameterName: "programId",
};
const orgUnitIdParameter = {
    urlParameterName: "orgUnitId",
};
const tetIdParameter = {
    urlParameterName: "trackedEntityTypeId",
};
const eventIdParameter = {
    urlParameterName: "viewEventId",
};

const specificationForPages = {
    [pageKeys.MAIN]: [programIdParameter, orgUnitIdParameter],
    [pageKeys.VIEW_EVENT]: [eventIdParameter],
    [pageKeys.SEARCH]: [programIdParameter, orgUnitIdParameter],
    [pageKeys.NEW]: [programIdParameter, orgUnitIdParameter, tetIdParameter],
};

const updaterForPages = {
    [pageKeys.MAIN]: updateSelectionsFromUrl,
    [pageKeys.SEARCH]: updateSelectionsFromUrl,
    [pageKeys.NEW]: updateSelectionsFromUrl,
    [pageKeys.VIEW_EVENT]: viewEventFromUrl,
    [pageKeys.ENROLLMENT_EVENT_NEW]: updateSelectionsFromUrl,
    [pageKeys.ENROLLMENT_EVENT]: viewEventFromUrl,
};

/**
 * Provides data for withUrlSync and calls an update action if not in sync (based on the page)
 * @alias withAppUrlSync
 * @memberof UrlSync
 * @function
 */
export const withAppUrlSync = () => InnerComponent => {
    class AppUrlSyncer extends React.Component {
        handleUpdate = updateData => {
            this.props.onUpdateFromUrl(this.page, updateData);
        };

        getSyncSpecification() {
            const page = this.page || pageKeys.MAIN;
            return specificationForPages[page] || [];
        }

        setPageAndParams() {
            const { location } = this.props;
            this.page = location.pathname.substring(1);
            this.params = parse(location && location.search);
        }

        render() {
            const { location, onUpdateFromUrl, locationSwitchInProgress, params, page, ...passOnProps } =
                this.props;

            if (locationSwitchInProgress) {
                return <LoadingMaskForPage />;
            }

            this.setPageAndParams();

            return (
                // $FlowFixMe[cannot-spread-inexact] automated comment
                <InnerComponent
                    statePage={page || pageKeys.MAIN}
                    urlPage={this.page}
                    urlParams={this.params}
                    onUpdate={this.handleUpdate}
                    syncSpecification={this.getSyncSpecification()}
                    stateParams={params}
                    {...passOnProps}
                />
            );
        }
    }

    const mapStateToProps = state => ({
        params: paramsSelector(state),
        page: state.app.page,
        locationSwitchInProgress: state.app.locationSwitchInProgress,
    });

    const mapDispatchToProps = dispatch => ({
        onUpdateFromUrl: (page, updateData) => {
            if (pageFetchesOrgUnitUsingTheOldWay(page) && page != null) {
                dispatch(updaterForPages[page](updateData));
            }
        },
    });

    // $FlowFixMe[missing-annot] automated comment
    return connect(mapStateToProps, mapDispatchToProps)(AppUrlSyncer);
};
