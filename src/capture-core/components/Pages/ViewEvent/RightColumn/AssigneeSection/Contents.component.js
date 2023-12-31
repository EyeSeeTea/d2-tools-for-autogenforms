//
import * as React from "react";
import { DisplayMode } from "./DisplayMode.component";
import { EditMode } from "./EditMode.component";

export const Contents = props => {
    const { onSet, ...passOnProps } = props;
    const [editMode, setEditMode] = React.useState(false);

    const handleSet = React.useCallback(
        user => {
            setEditMode(false);
            onSet(user);
        },
        [onSet]
    );

    const handleCancelSearch = React.useCallback(() => {
        setEditMode(false);
    }, []);

    if (editMode) {
        return <EditMode {...passOnProps} onSet={handleSet} onCancel={handleCancelSearch} />;
    }

    return (
        // $FlowFixMe[cannot-spread-inexact] automated comment
        <DisplayMode
            onEdit={() => {
                setEditMode(true);
            }}
            {...passOnProps}
        />
    );
};
