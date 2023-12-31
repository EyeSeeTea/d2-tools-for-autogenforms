//

import { createSelector } from "reselect";
import { convertServerToClient } from "../../../../converters";
import { getTrackedEntityTypeThrowIfNotFound, getTrackerProgramThrowIfNotFound } from "../../../../metaData";

const programIdSelector = props => props.programId;
const tetAttributesOnlySelector = props => props.tetAttributesOnly;
const tetIdSelector = props => props.errorData.tetId;

// $FlowFixMe
export const makeDataElementsSelector = () =>
    createSelector(
        programIdSelector,
        tetAttributesOnlySelector,
        tetIdSelector,
        (programId, tetAttributesOnly, tetId) => {
            if (tetAttributesOnly) {
                let teType;
                try {
                    teType = getTrackedEntityTypeThrowIfNotFound(tetId);
                } catch (error) {
                    return [];
                }

                return teType.attributes.filter(a => a.displayInReports);
            }

            let program;
            try {
                // $FlowFixMe[incompatible-call] automated comment
                program = getTrackerProgramThrowIfNotFound(programId);
            } catch (error) {
                return [];
            }

            return program.attributes.filter(a => a.displayInReports);
        }
    );

// $FlowFixMe
export const makeGetClientValuesSelector = () =>
    createSelector(
        (props, dataElements) => dataElements,
        props => props.attributeValues,
        (dataElements, attributeValues) =>
            dataElements.reduce((accClientValues, dataElement) => {
                const value = attributeValues[dataElement.id];
                if (value || value === 0 || value === false) {
                    accClientValues[dataElement.id] = dataElement.convertValue(value, convertServerToClient);
                }
                return accClientValues;
            }, {})
    );
