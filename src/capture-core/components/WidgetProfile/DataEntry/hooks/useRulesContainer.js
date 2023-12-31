//
import { useState, useEffect } from "react";

import { useProgramRules, useConstants } from "./index";
import { buildRulesContainer } from "../ProgramRules";

export const useRulesContainer = programAPI => {
    const { programRules, loading: loadingProgramRules } = useProgramRules(programAPI.id);
    const { constants } = useConstants();
    const [rulesContainer, setRulesContainer] = useState({});

    useEffect(() => {
        if (!loadingProgramRules && constants) {
            buildRulesContainer({ programAPI, setRulesContainer, programRules, constants });
        }
    }, [programAPI, loadingProgramRules, programRules, constants]);

    return rulesContainer;
};
