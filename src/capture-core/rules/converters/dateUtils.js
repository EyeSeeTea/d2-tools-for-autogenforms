//
/* eslint-disable class-methods-use-this */
import moment from "moment";
import { trimQuotes } from "capture-core-utils/rulesEngine/commonUtils/trimQuotes";

import { getFormattedStringFromMomentUsingEuropeanGlyphs } from "capture-core-utils/date";

const momentFormat = "YYYY-MM-DD";

function rulesDateToMoment(rulesEngineValue) {
    return moment(rulesEngineValue, momentFormat);
}
function momentToRulesDate(momentObject) {
    return getFormattedStringFromMomentUsingEuropeanGlyphs(momentObject);
}
function between(unit, firstRulesDate, secondRulesDate) {
    const firsRulesDateTrimmed = trimQuotes(firstRulesDate);
    const secondRulesDateTrimmed = trimQuotes(secondRulesDate);
    const firstDate = rulesDateToMoment(firsRulesDateTrimmed);
    const secondDate = rulesDateToMoment(secondRulesDateTrimmed);
    return secondDate.diff(firstDate, unit);
}

class DateUtils {
    getToday() {
        const todayMoment = moment();
        return momentToRulesDate(todayMoment);
    }
    daysBetween(firstRulesDate, secondRulesDate) {
        return between("days", firstRulesDate, secondRulesDate);
    }
    weeksBetween(firstRulesDate, secondRulesDate) {
        return between("weeks", firstRulesDate, secondRulesDate);
    }
    monthsBetween(firstRulesDate, secondRulesDate) {
        return between("months", firstRulesDate, secondRulesDate);
    }
    yearsBetween(firstRulesDate, secondRulesDate) {
        return between("years", firstRulesDate, secondRulesDate);
    }
    addDays(rulesDate, daysToAdd) {
        const rulesDateTrimmed = trimQuotes(rulesDate);
        const daysToAddTrimmed = trimQuotes(daysToAdd);
        const dateMoment = rulesDateToMoment(rulesDateTrimmed);
        const newDateMoment = dateMoment.add(daysToAddTrimmed, "days");
        const newRulesDate = momentToRulesDate(newDateMoment);
        return `'${newRulesDate}'`;
    }
    compareDates(firstRulesDate, secondRulesDate) {
        const diff = dateUtils.daysBetween(secondRulesDate, firstRulesDate);
        if (diff < 0) {
            return -1;
        }
        if (diff > 0) {
            return 1;
        }
        return 0;
    }
}

export const dateUtils = new DateUtils();
