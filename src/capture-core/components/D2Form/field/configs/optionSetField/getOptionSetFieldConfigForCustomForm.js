//
import { createFieldConfig, createProps } from "../base/configBaseCustomForm";
import { OptionSetSelectFieldForCustomForm, OptionSetBoxesFieldForCustomForm } from "../../Components";
import { getOptionsForRadioButtons, getOptionsForSelect } from "./optionSetHelpers";
import { orientations } from "../../../../FormFields/New";
import { inputTypes } from "../../../../../metaData/OptionSet/optionSet.const";

const mapInputTypeToPropsGetterFn = {
    [inputTypes.DROPDOWN]: metaData => ({
        // $FlowFixMe[incompatible-call] automated comment
        options: getOptionsForSelect(metaData.optionSet),
        nullable: !metaData.compulsory,
    }),
    [inputTypes.HORIZONTAL_RADIOBUTTONS]: metaData => ({
        // $FlowFixMe[incompatible-call] automated comment
        options: getOptionsForRadioButtons(metaData.optionSet),
    }),
    [inputTypes.VERTICAL_RADIOBUTTONS]: metaData => ({
        orientation: orientations.VERTICAL,

        // $FlowFixMe[incompatible-call] automated comment
        options: getOptionsForRadioButtons(metaData.optionSet),
    }),
};

const mapInputTypeToComponent = {
    [inputTypes.DROPDOWN]: OptionSetSelectFieldForCustomForm,
    [inputTypes.HORIZONTAL_RADIOBUTTONS]: OptionSetBoxesFieldForCustomForm,
    [inputTypes.VERTICAL_RADIOBUTTONS]: OptionSetBoxesFieldForCustomForm,
};

export const getOptionSetFieldConfigForCustomForm = (metaData, options) => {
    // $FlowFixMe[incompatible-type] automated comment
    const optionSet = metaData.optionSet;
    const inputType = optionSet.inputType;
    const inputTypeProps = mapInputTypeToPropsGetterFn[inputType](metaData);

    const props = createProps(
        {
            id: metaData.id,
            formId: options.formId,
            optionGroups: optionSet.optionGroups,
            ...inputTypeProps,
        },
        metaData
    );

    return createFieldConfig(
        {
            component: mapInputTypeToComponent[inputType],
            props,
            commitEvent: inputType === inputTypes.DROPDOWN ? "onBlur" : "onSelect",
        },
        metaData
    );
};
