//

import { createSelector } from "reselect";
import { getProgramEventAccess } from "../../../metaData";

const programIdSelector = (state, { programId }) => programId;
const programStageIdSelector = (state, { stageId }) => stageId;

// $FlowFixMe[missing-annot] automated comment
export const makeEventAccessSelector = () =>
    createSelector(
        programIdSelector,
        programStageIdSelector,
        (programId, programStageId) => programId && getProgramEventAccess(programId, programStageId)
    );
