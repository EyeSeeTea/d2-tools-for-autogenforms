//

import { actionCreator } from "../../../actions/actions.utils";

export const batchActionTypes = {
    BATCH_SET_TEI_SEARCH_PROGRAM: "BatchSetTeiSearchProgram",
};

export const actionTypes = {
    TEI_SEARCH_SET_PROGRAM: "TeiSearchSetProgram",
    TEI_SEARCH_START_SET_PROGRAM: "TeiSearchStartSetProgram",
};

export const startSetProgram = (searchId, programId) =>
    actionCreator(actionTypes.TEI_SEARCH_START_SET_PROGRAM)({ searchId, programId });
