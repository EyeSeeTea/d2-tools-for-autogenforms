//
/* eslint-disable no-underscore-dangle */
import log from "loglevel";
import i18n from "@dhis2/d2-i18n";
import { pipe, errorCreator } from "capture-core-utils";

import {
    DataElement,
    DateDataElement,
    DataElementUnique,
    dataElementUniqueScope,
    dataElementTypes,
    OptionSet,
    Option,
    optionSetInputTypes as inputTypes,
} from "../../../../metaData";
import { convertFormToClient, convertClientToServer } from "../../../../converters";
import { getApi } from "../../../../d2/d2Instance";
import { convertOptionSetValue } from "../../../../converters/serverToClient";
import { buildIcon } from "../../../../metaDataMemoryStoreBuilders/common/helpers";
import { OptionGroup } from "../../../../metaData/OptionSet/OptionGroup";

const OPTION_SET_NOT_FOUND = "Optionset not found";
const TRACKED_ENTITY_ATTRIBUTE_NOT_FOUND =
    "TrackedEntityAttributeId missing from programTrackedEntityAttribute or trackedEntityAttribute not found";

const buildDataElementUnique = (dataElement, trackedEntityAttribute) =>
    new DataElementUnique(dataEntry => {
        dataEntry.scope = trackedEntityAttribute.orgunitScope
            ? dataElementUniqueScope.ORGANISATION_UNIT
            : dataElementUniqueScope.ENTIRE_SYSTEM;

        dataEntry.onValidate = (value, contextProps = {}) => {
            const serverValue = pipe(convertFormToClient, convertClientToServer)(
                value,
                trackedEntityAttribute.valueType
            );

            if (contextProps.onGetUnsavedAttributeValues) {
                const unsavedAttributeValues = contextProps.onGetUnsavedAttributeValues(dataElement.id);
                if (unsavedAttributeValues) {
                    const foundValue = unsavedAttributeValues.find(usav => usav === serverValue);
                    if (foundValue) {
                        return {
                            valid: false,
                            data: {
                                attributeValueExistsUnsaved: true,
                            },
                        };
                    }
                }
            }

            let requestPromise;
            if (dataEntry.scope === dataElementUniqueScope.ORGANISATION_UNIT) {
                const orgUnitId = contextProps.orgUnitId;
                requestPromise = getApi().get("tracker/trackedEntities", {
                    program: contextProps.programId,
                    ou: orgUnitId,
                    filter: `${dataElement.id}:EQ:${serverValue}`,
                });
            } else {
                requestPromise = getApi().get("tracker/trackedEntities", {
                    program: contextProps.programId,
                    ouMode: "ACCESSIBLE",
                    filter: `${dataElement.id}:EQ:${serverValue}`,
                });
            }
            return requestPromise.then(result => {
                const otherTrackedEntityInstances =
                    result?.instances?.filter(
                        item => item.trackedEntity !== contextProps.trackedEntityInstanceId
                    ) || [];
                const trackedEntityInstance =
                    (otherTrackedEntityInstances && otherTrackedEntityInstances[0]) || {};

                const data = {
                    id: trackedEntityInstance.trackedEntityInstance,
                    tetId: trackedEntityInstance.trackedEntityType,
                };

                return {
                    valid: otherTrackedEntityInstances.length === 0,
                    data,
                };
            });
        };

        if (trackedEntityAttribute.pattern) {
            dataEntry.generatable = !!trackedEntityAttribute.pattern;
        }
    });

const setBaseProperties = async (
    dataElement,
    optionSets,
    programTrackedEntityAttribute,
    trackedEntityAttribute
) => {
    dataElement.id = trackedEntityAttribute.id;
    dataElement.compulsory = programTrackedEntityAttribute.mandatory;
    dataElement.name = trackedEntityAttribute.displayName;
    dataElement.shortName = trackedEntityAttribute.displayShortName;
    dataElement.formName = trackedEntityAttribute.displayFormName;
    dataElement.description = trackedEntityAttribute.description;
    dataElement.displayInForms = true;
    dataElement.displayInReports = programTrackedEntityAttribute.displayInList;
    dataElement.disabled = false;
    dataElement.type = trackedEntityAttribute.valueType;
    dataElement.searchable = programTrackedEntityAttribute.searchable;

    if (trackedEntityAttribute.unique) {
        dataElement.unique = buildDataElementUnique(dataElement, trackedEntityAttribute);
    }

    if (trackedEntityAttribute.optionSet && trackedEntityAttribute.optionSet.id) {
        dataElement.optionSet = await buildOptionSet(
            dataElement,
            optionSets,
            trackedEntityAttribute.optionSet.id,
            programTrackedEntityAttribute.renderOptionsAsRadio
        );
    }
};

const buildBaseDataElement = async (optionSets, programTrackedEntityAttribute, trackedEntityAttribute) => {
    const dataElement = new DataElement();
    dataElement.type = trackedEntityAttribute.valueType;
    await setBaseProperties(dataElement, optionSets, programTrackedEntityAttribute, trackedEntityAttribute);
    return dataElement;
};

const buildDateDataElement = async (optionSets, programTrackedEntityAttribute, trackedEntityAttribute) => {
    const dateDataElement = new DateDataElement();
    dateDataElement.type = dataElementTypes.DATE;
    dateDataElement.allowFutureDate = programTrackedEntityAttribute.allowFutureDate;
    await setBaseProperties(
        dateDataElement,
        optionSets,
        programTrackedEntityAttribute,
        trackedEntityAttribute
    );
    return dateDataElement;
};

const buildOptionSet = async (dataElement, optionSets, optionSetId, renderOptionsAsRadio) => {
    const optionSetAPI = optionSets.find(optionSet => optionSet.id === optionSetId);

    if (!optionSetAPI) {
        log.warn(errorCreator(OPTION_SET_NOT_FOUND)({ id: optionSetId }));
        return null;
    }
    dataElement.type = optionSetAPI.valueType;

    const optionsPromises = optionSetAPI.options.map(async optionSetOption => {
        const icon = buildIcon(optionSetOption.style);
        return new Option(option => {
            option.id = optionSetOption.id;
            option.value = optionSetOption.code;
            option.text = optionSetOption.displayName;
            option.icon = icon;
        });
    });

    const options = await Promise.all(optionsPromises);

    const optionGroups =
        optionSetAPI.optionGroups &&
        new Map(
            optionSetAPI.optionGroups.map(group => [
                group.id,
                new OptionGroup(o => {
                    o.id = group.id;
                    o.optionIds = new Map(group.options.map(option => [option, option]));
                }),
            ])
        );

    const optionSet = new OptionSet(
        optionSetAPI.id,
        options,
        optionGroups,
        dataElement,
        convertOptionSetValue
    );
    optionSet.inputType = renderOptionsAsRadio ? inputTypes.VERTICAL_RADIOBUTTONS : null;
    return optionSet;
};

export const buildTetFeatureType = featureType => {
    const dataElement = new DataElement(dataEntry => {
        dataEntry.id = `FEATURETYPE_${featureType}`;
        dataEntry.name = featureType === "POINT" ? i18n.t("Coordinate") : i18n.t("Area");
        dataEntry.formName = dataEntry.name;
        dataEntry.compulsory = false;
        dataEntry.displayInForms = true;
        dataEntry.disabled = false;
        dataEntry.type = featureType === "POINT" ? dataElementTypes.COORDINATE : dataElementTypes.POLYGON;
    });
    return dataElement;
};

export const buildDataElement = (programTrackedEntityAttribute, trackedEntityAttributes, optionSets) => {
    const trackedEntityAttribute =
        programTrackedEntityAttribute.trackedEntityAttributeId &&
        trackedEntityAttributes.find(
            trackedEntityAttributeAPI =>
                trackedEntityAttributeAPI.id === programTrackedEntityAttribute.trackedEntityAttributeId
        );

    if (!trackedEntityAttribute) {
        log.error(
            errorCreator(TRACKED_ENTITY_ATTRIBUTE_NOT_FOUND)({
                programTrackedEntityAttribute,
            })
        );
        return null;
    }

    return trackedEntityAttribute.valueType === dataElementTypes.DATE
        ? buildDateDataElement(optionSets, programTrackedEntityAttribute, trackedEntityAttribute)
        : buildBaseDataElement(optionSets, programTrackedEntityAttribute, trackedEntityAttribute);
};
