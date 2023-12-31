//
import React from "react";

import { IconInfo16, colors } from "@dhis2/ui";
import { withStyles } from "@material-ui/core/styles";

const styles = {
    descriptionBox: {
        display: "flex",
        marginBottom: 8,
        marginRight: 15,
        color: colors.grey700,
    },
    icon: {
        minWidth: 16,
        marginLeft: 10,
        marginRight: 5,
        marginTop: 1,
    },
    description: {
        fontSize: 13,
        lineHeight: "17px",
    },
};

const SectionDescriptionBoxPlain = props => {
    const { classes, description } = props;

    return (
        <div className={classes.descriptionBox}>
            <div className={classes.icon}>
                <IconInfo16 />
            </div>
            <div className={classes.description}>{description}</div>
        </div>
    );
};

export const SectionDescriptionBox = withStyles(styles)(SectionDescriptionBoxPlain);
