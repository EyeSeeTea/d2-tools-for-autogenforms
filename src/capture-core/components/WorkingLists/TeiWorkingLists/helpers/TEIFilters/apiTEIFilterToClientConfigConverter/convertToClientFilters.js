//
import moment from "moment";

import { getOptionSetFilter } from "./optionSet";
import { filterTypesObject } from "../../../../WorkingListsBase";

import { areRelativeRangeValuesSupported } from "../../../../../../utils/validators/areRelativeRangeValuesSupported";
import { DATE_TYPES, ASSIGNEE_MODES } from "../../../constants";

const getTextFilter = filter => {
    const value = filter.like;
    return value ? { value } : undefined;
};

const getNumericFilter = filter => {
    if (filter.ge || filter.le) {
        return {
            ge: Number(filter.ge),
            le: Number(filter.le),
        };
    }
    return undefined;
};

const getBooleanFilter = filter => {
    if (filter.in) {
        return { values: filter.in.map(value => value === "true") };
    }
    return undefined;
};

const getTrueOnlyFilter = (/* filter: ApiDataFilterTrueOnly */) => ({
    value: true,
});

const getDateFilterContent = dateFilter => {
    if (dateFilter.type === DATE_TYPES.RELATIVE) {
        if (dateFilter.period) {
            return {
                type: dateFilter.type,
                period: dateFilter.period,
            };
        }
        if (areRelativeRangeValuesSupported(dateFilter.startBuffer, dateFilter.endBuffer)) {
            return {
                type: dateFilter.type,
                startBuffer: dateFilter.startBuffer,
                endBuffer: dateFilter.endBuffer,
            };
        }
        return undefined;
    }
    if (dateFilter.type === DATE_TYPES.ABSOLUTE && (dateFilter.startDate || dateFilter.endDate)) {
        return {
            type: dateFilter.type,
            ge: moment(dateFilter.startDate, "YYYY-MM-DD").toISOString(),
            le: moment(dateFilter.endDate, "YYYY-MM-DD").toISOString(),
        };
    }
    return undefined;
};

const getDateFilter = ({ dateFilter }) => getDateFilterContent(dateFilter);

const isOptionSetFilter = (type, filter) => {
    if ([filterTypesObject.BOOLEAN].includes(type)) {
        const validBooleanValues = ["true", "false"];
        return filter.in.some(value => !validBooleanValues.includes[value]);
    }
    return filter.in;
};

const getFilterByType = {
    [filterTypesObject.TEXT]: getTextFilter,
    [filterTypesObject.NUMBER]: getNumericFilter,
    [filterTypesObject.INTEGER]: getNumericFilter,
    [filterTypesObject.INTEGER_POSITIVE]: getNumericFilter,
    [filterTypesObject.INTEGER_NEGATIVE]: getNumericFilter,
    [filterTypesObject.INTEGER_ZERO_OR_POSITIVE]: getNumericFilter,
    [filterTypesObject.DATE]: getDateFilter,
    [filterTypesObject.BOOLEAN]: getBooleanFilter,
    [filterTypesObject.TRUE_ONLY]: getTrueOnlyFilter,
};

const convertDataElementFilters = (filters, columnsMetaForDataFetching) =>
    filters.reduce((acc, serverFilter) => {
        const element = columnsMetaForDataFetching.get(serverFilter.attribute);

        // $FlowFixMe I accept that not every type is listed, thats why I'm doing this test
        if (!element || !getFilterByType[element.type]) {
            return acc;
        }
        // $FlowFixMe
        const value = isOptionSetFilter(element.type, serverFilter)
            ? // $FlowFixMe
              getOptionSetFilter(serverFilter, element.type)
            : // $FlowFixMe
              getFilterByType[element.type](serverFilter);

        return value ? { ...acc, [serverFilter.attribute]: value } : acc;
    }, {});

const getAssigneeFilter = async (assignedUsers, querySingleResource) => {
    // DHIS2-12500 - The UI element provides suport for only one user
    const assignedUserId = assignedUsers && assignedUsers.length > 0 && assignedUsers[0];
    if (!assignedUserId) {
        return null;
    }
    const user = await querySingleResource({
        resource: `userLookup/${assignedUserId}`,
    });
    if (!user || !user.displayName) {
        return null;
    }
    const { id, displayName: name, username } = user;
    return { id, name, username };
};

export const convertToClientFilters = async (
    TEIQueryCriteria,
    columnsMetaForDataFetching,
    querySingleResource
) => {
    let filters = {};
    if (!TEIQueryCriteria) {
        return filters;
    }
    const { programStatus, enrolledAt, occurredAt, assignedUserMode, assignedUsers, attributeValueFilters } =
        TEIQueryCriteria;

    if (programStatus) {
        filters = {
            ...filters,
            programStatus: {
                usingOptionSet: true,
                values: [programStatus],
            },
        };
    }
    if (enrolledAt) {
        filters = { ...filters, enrolledAt: getDateFilterContent(enrolledAt) };
    }
    if (occurredAt) {
        filters = { ...filters, occurredAt: getDateFilterContent(occurredAt) };
    }
    if (assignedUserMode && assignedUserMode !== ASSIGNEE_MODES.PROVIDED) {
        filters = { ...filters, assignee: { assignedUserMode } };
    }
    if (assignedUserMode && assignedUserMode === ASSIGNEE_MODES.PROVIDED && assignedUsers) {
        const assignedUser = await getAssigneeFilter(assignedUsers, querySingleResource);
        if (assignedUser) {
            filters = { ...filters, assignee: { assignedUserMode, assignedUser } };
        }
    }
    if (attributeValueFilters && attributeValueFilters.length > 0) {
        filters = {
            ...filters,
            ...convertDataElementFilters(attributeValueFilters, columnsMetaForDataFetching),
        };
    }
    return filters;
};
