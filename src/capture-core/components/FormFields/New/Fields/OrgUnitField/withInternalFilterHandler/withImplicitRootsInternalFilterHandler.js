//
import * as React from "react";
import { withInternalFilterHandler } from "./withInternalFilterHandler";
import { get as getOrgUnitRoots } from "../orgUnitRoots.store";
import { orgUnitFieldScopes } from "./scopes.const";

// Wraps withInternalFilterHandler. Passes on defaultRoots from the organisation unit store based on the input scope.
export const withOrgUnitFieldImplicitRootsFilterHandler = () => InnerComponent => {
    const InternalFilterHandlerHOC = withInternalFilterHandler()(InnerComponent);

    class OrgUnitImplicitInternalFilterHandlerHOC extends React.Component {
        constructor(props) {
            super(props);
            const { scope } = this.props;
            this.defaultRoots =
                getOrgUnitRoots(OrgUnitImplicitInternalFilterHandlerHOC.DEFAULT_ROOTS_DATA[scope]) || [];
        }
        static DEFAULT_ROOTS_DATA = {
            [orgUnitFieldScopes.USER_CAPTURE]: "captureRoots",
            [orgUnitFieldScopes.USER_SEARCH]: "search",
        };

        render() {
            const { ...passOnProps } = this.props;
            return (
                // $FlowFixMe
                <InternalFilterHandlerHOC defaultRoots={this.defaultRoots} {...passOnProps} />
            );
        }
    }
    return OrgUnitImplicitInternalFilterHandlerHOC;
};
