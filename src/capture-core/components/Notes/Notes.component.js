//

import * as React from "react";
import { Editor, Parser } from "@dhis2/d2-ui-rich-text";
import { List, ListItem, Tooltip, withStyles } from "@material-ui/core";
import i18n from "@dhis2/d2-i18n";
import { withFocusSaver } from "capture-ui";
import { Button } from "../Buttons";
import { TextField } from "../FormFields/New";

const FocusTextField = withFocusSaver()(TextField);

const styles = theme => ({
    noteItem: {
        display: "flex",
        flexDirection: "column",
        alignItems: "normal",
        background: theme.palette.grey.lighter,
        marginBottom: theme.typography.pxToRem(3),
        fontSize: theme.typography.pxToRem(14),
    },
    commandButton: {
        width: theme.typography.pxToRem(30),
        height: theme.typography.pxToRem(30),
    },
    borderBoxContent: {
        margin: theme.typography.pxToRem(10),
    },
    newCommentButtonContainer: {
        marginTop: theme.typography.pxToRem(10),
    },
    newNoteContainer: {},
    newNoteFormContainer: {
        background: theme.palette.grey.lighter,
        padding: theme.typography.pxToRem(10),
    },
    notesContainer: {},
    noteItemHeader: {
        display: "flex",
    },
    noteItemUser: {
        flexGrow: 1,
        fontWeight: "bold",
    },
    noteItemDate: {
        color: "#757575",
    },
    notesList: {
        padding: 0,
    },
    newNoteButtonContainer: {
        display: "inline-block",
    },
    addCommentContainer: {
        marginRight: 5,
        marginLeft: 2,
    },
});

class NotesPlain extends React.Component {
    static defaultProps = {
        entityAccess: { read: true, write: true },
    };
    constructor(props) {
        super(props);
        this.state = {
            addIsOpen: !!this.props.value,
            value: this.props.value || null,
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.value !== this.props.value || this.props.value !== this.state.value) {
            this.setState({
                value: nextProps.value,
            });
        }
    }

    toggleIsOpen = () => {
        this.setState(prevState => ({
            addIsOpen: !prevState.addIsOpen,
        }));
    };

    onCancel = () => {
        this.props.onBlur(null, { touched: false });
        this.toggleIsOpen();
    };

    onNewNoteEditorBlur = value => {
        this.props.onBlur(value, { touched: false });
    };

    handleAddNote = () => {
        if (this.props.value) {
            this.props.onAddNote(this.props.value);
        }
        this.toggleIsOpen();
        this.props.onBlur(null, { touched: false });
    };

    handleChange = value => {
        this.setState({ value });
    };

    renderInput = () => {
        const { classes } = this.props;
        return (
            <div className={classes.newNoteFormContainer}>
                <Editor onEdit={this.handleChange}>
                    <FocusTextField
                        onBlur={this.onNewNoteEditorBlur}
                        onChange={this.handleChange}
                        value={this.state.value}
                        multiLine
                        data-test="comment-textfield"
                    />
                </Editor>
                <div className={classes.newCommentButtonContainer} data-test="comment-buttons-container">
                    <Button onClick={this.handleAddNote} className={classes.addCommentContainer} primary>
                        {i18n.t("Add comment")}
                    </Button>
                    <Button onClick={this.onCancel}>{i18n.t("Cancel")}</Button>
                </div>
            </div>
        );
    };

    renderButton = canAddComment => {
        const { smallMainButton, classes } = this.props;
        return (
            <Tooltip title={canAddComment ? "" : i18n.t("You dont have access to write comments")}>
                <div className={classes.newNoteButtonContainer} data-test="new-comment-button">
                    <Button onClick={this.toggleIsOpen} disabled={!canAddComment} small={smallMainButton}>
                        {i18n.t("Write comment")}
                    </Button>
                </div>
            </Tooltip>
        );
    };

    render = () => {
        const { notes, classes, entityAccess } = this.props;
        return (
            <div className={classes.notesContainer}>
                <List dense className={classes.notesList} data-test="comments-list">
                    {notes.map(n => (
                        <ListItem className={classes.noteItem} key={n.clientId} data-test="comment">
                            <div className={classes.noteItemHeader}>
                                <div className={classes.noteItemUser} data-test="comment-user">
                                    {n.storedBy}
                                </div>
                                <div className={classes.noteItemDate} data-test="comment-date">
                                    {n.storedDate}
                                </div>
                            </div>
                            <div data-test="comment-text">
                                <Parser>{n.value}</Parser>
                            </div>
                        </ListItem>
                    ))}
                </List>
                {
                    <div className={classes.newNoteContainer} data-test="new-comment-container">
                        {this.state.addIsOpen ? this.renderInput() : this.renderButton(entityAccess.write)}
                    </div>
                }
            </div>
        );
    };
}

export const Notes = withStyles(styles)(NotesPlain);
