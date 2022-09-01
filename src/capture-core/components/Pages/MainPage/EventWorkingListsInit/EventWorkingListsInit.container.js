//
import React from "react";
import { useSelector } from "react-redux";
import { EventWorkingListsInitConnectionStatusResolver } from "./ConnectionStatusResolver";

export const EventWorkingListsInit = ({ ...passOnProps }) => {
    const isOnline = useSelector(
        ({ offline: { online }, app: { goingOnlineInProgress } }) => !!online && !goingOnlineInProgress
    );
    const mutationInProgress = useSelector(({ offline: { outbox } }) => outbox && outbox.length > 0);

    return (
        <EventWorkingListsInitConnectionStatusResolver
            {...passOnProps}
            storeId="eventList"
            isOnline={isOnline}
            mutationInProgress={mutationInProgress}
        />
    );
};
