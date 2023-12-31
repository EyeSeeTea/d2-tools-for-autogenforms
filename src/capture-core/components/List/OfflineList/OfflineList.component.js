//
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import i18n from "@dhis2/d2-i18n";

import {
    Table,
    Row,
    Cell,
    HeaderCell,
    Head,
    Body,
    sortLabelDirections,
    sorLabelPlacements,
} from "capture-ui";
import { SortLabelWrapper } from "../../DataTable/SortLabelWrapper.component";
import { dataElementTypes } from "../../../metaData";

const styles = theme => ({
    loaderContainer: {
        display: "flex",
        justifyContent: "center",
    },
    container: {
        borderColor:
            theme.palette.type === "light" ? theme.palette.dividerLighter : theme.palette.dividerDarker,
        borderWidth: "1px",
        borderStyle: "solid",
    },
    topBarContainer: {
        display: "flex",
        justifyContent: "space-between",
    },
    tableContainer: {
        overflow: "auto",
    },
    optionsIcon: {
        color: theme.palette.primary.main,
    },
    table: {},
    row: {},
    cell: {
        padding: `${theme.spacing.unit / 2}px ${theme.spacing.unit * 7}px ${theme.spacing.unit / 2}px ${
            theme.spacing.unit * 3
        }px`,
        "&:last-child": {
            paddingRight: theme.spacing.unit * 3,
        },
        borderBottomColor:
            theme.palette.type === "light" ? theme.palette.dividerLighter : theme.palette.dividerDarker,
    },
    bodyCell: {
        fontSize: theme.typography.pxToRem(13),
        color: theme.palette.text.primary,
    },
    headerCell: {
        fontSize: theme.typography.pxToRem(12),
        color: theme.palette.text.secondary,
        fontWeight: theme.typography.fontWeightMedium,
    },
});

class Index extends Component {
    static defaultProps = {
        rowIdKey: "id",
    };
    static typesWithAscendingInitialDirection = [
        // todo (report lgmt)
        dataElementTypes.TEXT,
        dataElementTypes.LONG_TEXT,
    ];

    static typesWithRightPlacement = [
        dataElementTypes.NUMBER,
        dataElementTypes.INTEGER,
        dataElementTypes.INTEGER_POSITIVE,
        dataElementTypes.INTEGER_NEGATIVE,
        dataElementTypes.INTEGER_ZERO_OR_POSITIVE,
    ];

    renderHeaderRow(visibleColumns) {
        const sortById = this.props.sortById;
        const sortByDirection = this.props.sortByDirection;

        const headerCells = visibleColumns.map(column => (
            <HeaderCell
                key={column.id}
                className={classNames(this.props.classes.cell, this.props.classes.headerCell)}
            >
                <SortLabelWrapper
                    isActive={column.id === sortById}
                    initialDirection={
                        Index.typesWithAscendingInitialDirection.includes(column.type)
                            ? sortLabelDirections.ASC
                            : sortLabelDirections.DESC
                    }
                    placement={
                        Index.typesWithRightPlacement.includes(column.type)
                            ? sorLabelPlacements.RIGHT
                            : sorLabelPlacements.LEFT
                    }
                    direction={sortByDirection}
                    disabled
                >
                    {column.header}
                </SortLabelWrapper>
            </HeaderCell>
        ));

        return <Row className={this.props.classes.row}>{headerCells}</Row>;
    }

    renderRows(visibleColumns) {
        const { dataSource, classes, noItemsText, rowIdKey } = this.props;

        if (!dataSource || dataSource.length === 0) {
            const columnsCount = visibleColumns.length;
            return (
                <Row className={classes.row}>
                    <Cell colSpan={columnsCount} className={classNames(classes.cell, classes.bodyCell)}>
                        {noItemsText || i18n.t("No items to display")}
                    </Cell>
                </Row>
            );
        }

        return dataSource.map(row => {
            const cells = visibleColumns.map(column => (
                <Cell key={column.id} className={classNames(classes.cell, classes.bodyCell)}>
                    <div
                        style={
                            Index.typesWithRightPlacement.includes(column.type)
                                ? { textAlign: "right" }
                                : null
                        }
                    >
                        {row[column.id]}
                    </div>
                </Cell>
            ));

            return (
                <Row key={row[rowIdKey]} className={classes.row}>
                    {cells}
                </Row>
            );
        });
    }

    render() {
        const { columns, classes } = this.props;

        const visibleColumns = columns ? columns.filter(column => column.visible) : [];

        return (
            <div className={classes.container}>
                <div className={classes.topBarContainer} />
                <div className={classes.tableContainer}>
                    <Table className={classes.table}>
                        <Head>{this.renderHeaderRow(visibleColumns)}</Head>
                        <Body>{this.renderRows(visibleColumns)}</Body>
                    </Table>
                </div>
            </div>
        );
    }
}
export const OfflineList = withStyles(styles)(Index);
