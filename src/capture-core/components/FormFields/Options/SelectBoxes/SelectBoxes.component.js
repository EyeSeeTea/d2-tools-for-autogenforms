//
import React, { useMemo } from "react";

import { MultiSelectBoxes, multiOrientations } from "../MultiSelectBoxes";
import { SingleSelectBoxes, singleOrientations } from "../SingleSelectBoxes";
import { orientations } from "./selectBoxes.const";

export const SelectBoxes = props => {
    const { multiSelect, options, optionSet, orientation, ...passOnProps } = props;

    // $FlowFixMe even with a cheat flow could not figure out this one
    const outputOptions = useMemo(() => {
        if (optionSet) {
            return optionSet.options.map(({ text, value }) => ({ text, value }));
        }
        return options;
    }, [optionSet, options]);

    const [SelectBoxesTypeComponent, typeOrientation] = multiSelect
        ? [
              MultiSelectBoxes,
              orientations.VERTICAL ? multiOrientations.VERTICAL : multiOrientations.HORIZONTAL,
          ]
        : [
              SingleSelectBoxes,
              orientations.VERTICAL ? singleOrientations.VERTICAL : singleOrientations.HORIZONTAL,
          ];

    return (
        <SelectBoxesTypeComponent {...passOnProps} orientation={typeOrientation} options={outputOptions} />
    );
};
