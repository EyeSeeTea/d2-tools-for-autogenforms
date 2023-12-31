//
import { connect } from "react-redux";
import { ProgramSelectorComponent } from "./ProgramSelector.component";
import { changeProgram, clearProgramFilter } from "../registrationSection.actions";

const mapStateToProps = state => ({
    orgUnitIds: state.newRelationshipRegisterTei.orgUnit
        ? [state.newRelationshipRegisterTei.orgUnit.id]
        : null,
    trackedEntityTypeId: state.newRelationship.selectedRelationshipType.to.trackedEntityTypeId,
    value: state.newRelationshipRegisterTei.programId,
});

const mapDispatchToProps = dispatch => ({
    onUpdateSelectedProgram: programId => {
        dispatch(changeProgram(programId));
    },
    onClearFilter: () => {
        dispatch(clearProgramFilter());
    },
});

// $FlowSuppress
// $FlowFixMe[missing-annot] automated comment
export const ProgramSelector = connect(mapStateToProps, mapDispatchToProps)(ProgramSelectorComponent);
