//
import React, { useState } from "react";
import i18n from "@dhis2/d2-i18n";
import { Widget } from "../Widget";

import { WidgetFeedbackContent } from "./WidgetFeedbackContent/WidgetFeedbackContent";

export const WidgetFeedback = ({ feedback, emptyText }) => {
    const [openStatus, setOpenStatus] = useState(true);

    return (
        <div data-test="feedback-widget">
            <Widget
                header={i18n.t("Feedback")}
                onOpen={() => setOpenStatus(true)}
                onClose={() => setOpenStatus(false)}
                open={openStatus}
            >
                <WidgetFeedbackContent widgetData={feedback} emptyText={emptyText} />
            </Widget>
        </div>
    );
};
