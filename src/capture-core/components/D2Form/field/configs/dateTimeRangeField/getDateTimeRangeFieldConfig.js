//
import { orientations } from "../../../../FormFields/New";
import { createFieldConfig, createProps } from "../base/configBaseDefaultForm";
import { DateTimeRangeFieldForForm } from "../../Components";

const getCalendarAnchorPosition = formHorizontal => (formHorizontal ? "center" : "left");

export const getDateTimeRangeFieldConfig = (metaData, options) => {
    const props = createProps(
        {
            formHorizontal: options.formHorizontal,
            fieldLabelMediaBasedClass: options.fieldLabelMediaBasedClass,
            dateWidth: options.formHorizontal ? 150 : "100%",
            dateMaxWidth: options.formHorizontal ? 150 : 350,
            orientation: options.formHorizontal ? orientations.VERTICAL : orientations.HORIZONTAL,
            shrinkDisabled: options.formHorizontal,
            calendarWidth: options.formHorizontal ? 250 : 350,
            popupAnchorPosition: getCalendarAnchorPosition(options.formHorizontal),
        },
        options,
        metaData
    );

    return createFieldConfig(
        {
            component: DateTimeRangeFieldForForm,
            props,
        },
        metaData
    );
};
