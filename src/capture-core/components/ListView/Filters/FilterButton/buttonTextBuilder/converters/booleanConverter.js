//
import i18n from "@dhis2/d2-i18n";
import { pipe } from "capture-core-utils";

const getText = key => (key ? i18n.t("Yes") : i18n.t("No"));

export function convertBoolean(filter) {
    return pipe(
        values => values.map(value => getText(value)),
        values => values.join(", ")
    )(filter.values);
}
