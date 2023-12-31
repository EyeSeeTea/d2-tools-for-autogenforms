//
import { queryRecursively } from "../../IOUtils";

export const queryProgramsOutline = async () => {
    const specification = {
        resource: "programs",
        params: {
            fields:
                "id,version,programTrackedEntityAttributes[trackedEntityAttribute[id,optionSet[id,version]]]," +
                "programStages[id,programStageDataElements[dataElement[id,optionSet[id,version]]]]",
        },
    };

    return (await queryRecursively(specification, { pageSize: 1000 })).flatMap(
        responseItem => (responseItem && responseItem.programs) || []
    );
};
