import React from "react";
import styled from "styled-components";
import map from "lodash/map";
import get from "lodash/get";
import posed, { PoseGroup } from "react-pose";
import isToday from "date-fns/is_today";
import isYesterday from "date-fns/is_yesterday";
import isAfter from "date-fns/is_after";
import subDays from "date-fns/sub_days";
import format from "date-fns/format";

import { colors, effects, fontSizes } from "./constants";
import { ActionTextArea, ActionIcon, ActionIconImage, Button } from ".";
import { getReminders } from "../../utils";

var ContextDelta = require("./ContextDelta").default;

const ActionCardContainer = styled.section`
  width: calc(80% - 50px);
  min-height: 160px;
  margin: 10px auto;
  padding: 15px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  background-color: ${colors.backgroundAccent};
  position: relative;
  box-shadow: ${effects.cardBoxShadow};
  color: ${colors.black};
`;

const ActionHeading = styled.section`
  display: flex;
  align-items: center;
  width: 100%;
`;

const ActionCopy = styled.p`
  font-size: ${fontSizes.medium};
  margin: 0 0 20px 0;
`;

const ActionBody = styled.section`
  flex-grow: 1;
  width: 100%;
  display: flex;
`;

const StudentHeading = styled.h2`
  font-size: ${fontSizes.large};
  margin-left: 25px;
`;

const BaseIcon = styled.i`
  position: absolute;
  font-size: 18px;
  top: 10px;
  cursor: pointer;
`;

const DeleteIcon = styled(BaseIcon)`
  right: 30px;
`;

const CloseIcon = styled(BaseIcon)`
  right: 10px;
`;

const ActionLeftPanel = styled.section``;

const ActionContextPanel = styled.section`
  width: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  margin-left: 20px;
`;

const PosedParagraph = posed.p();

const ContextHeading = styled.h3`
  font-size: ${fontSizes.large};
  margin: 0;
  font-weight: 400;
`;

const ContextPoseGroup = styled(PoseGroup)`
  overflow: scroll;
`;

const ContextHr = styled.hr`
  width: 75%;
  margin: 0 auto;
  border: 0.5px solid ${colors.textGrey};
`;

const PosedContextDelta = posed(ContextDelta)({
  enter: {
    opacity: 1,
    delay: 200,
  },
  exit: {
    opacity: 0,
    delay: 300,
  },
});

const ActionTextAreaContainer = styled.div`
  display: flex;
  margin: auto;
`;

const ErrorField = styled.h4`
  font-size: ${fontSizes.xsmall};
  color: ${colors.errorOrange};
  margin: ${({ visible }) => {
    return visible ? "10px 0px;" : "0px;";
  }}
  visibility: ${({ visible }) => {
    return visible ? "visible;" : "hidden";
  }}
`;

const ActionButtonGroup = styled.div`
  display: ${({ visible }) => {
    return visible ? "flex;" : "none;";
  }};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;

const Divider = styled.span`
  margin: 15px 10px;
`;

const ReminderList = styled(
  posed.ul({
    showReminders: {
      opacity: 1,
      transition: {
        duration: 3000,
      },
      staggerChildren: 200,
    },
    hideReminders: { opacity: 0 },
  })
)`
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
`;

const ReminderOption = styled.li`
  border: 1px solid ${colors.borderGrey};
  background: ${colors.white};
  font-size: ${fontSizes.small};
  margin: 8px 5px;
  padding: 5px 8px;
  cursor: pointer;
`;

const ActionNote = styled.p`
  font-size: ${fontSizes.large};
`;

const ActionFooter = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
`;

const ActionDate = styled.p`
  opacity: 0.5;
  margin: 0px 15px;
  font-size: ${fontSizes.medium};
  display: ${({ visible }) => {
    return visible ? "block;" : "none;";
  }};
`;

const REMINDERS = getReminders();

class ActionCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      noteError: false,
      pose: "hideReminders",
      note: props.action.note || "",
    };
  }

  componentWillReceiveProps(nextProps) {
    const oldNote = get(this.props, "action.note");
    const newNote = get(nextProps, "action.note");
    if (newNote && oldNote !== newNote) {
      this.setState({ note: newNote });
    }
  }

  handleNoteUpdate = e => {
    const newText = e.target.value;
    if (newText) {
      this.setState({ noteError: false });
    }
    this.setState({ note: newText });
  };

  showReminders = () => {
    this.setState({ pose: "showReminders" });
  };

  handleFormSubmission = (completed = false, dueOn = null) => {
    const { note } = this.state;
    if (!note) {
      this.setState({ noteError: true });
      return;
    }
    const {
      closeActionForm,
      saveAction,
      type,
      student: { id: studentId },
      action,
      contextDeltas,
    } = this.props;
    const actionPayload = {
      type,
      note,
      studentId,
      dueOn,
      completed,
      deltaIDs: map(contextDeltas, "delta_id"),
    };

    if (action && action.id) {
      actionPayload.actionId = action.id;
    }
    saveAction(actionPayload).then(resp => {
      if (resp.status === 201 && closeActionForm) {
        closeActionForm();
      }
    });
  };

  getReminderButtons = () => {
    return (
      <ReminderList
        pose={this.state.pose}
        style={{
          display: this.state.pose === "hideReminders" ? "none" : "inline-flex",
        }}
      >
        {map(REMINDERS, (r, i) => {
          return (
            <ReminderOption
              onClick={this.handleFormSubmission.bind(this, false, r.reminderDate)}
              key={i}
            >
              {r.copy}
            </ReminderOption>
          );
        })}
      </ReminderList>
    );
  };

  getActionIcon = () => {
    const {
      action: { id, type },
    } = this.props;
    let iconNode = null;
    if (!id) {
      return null;
    }
    switch (type) {
      case "call":
        iconNode = <ActionIcon className="fa-phone" />;
        break;
      case "message":
        iconNode = <ActionIcon className="fa-comment-alt" />;
        break;
      default:
        iconNode = <ActionIconImage imageFileName="note_icon.png" actionAlt="Make a Note icon" />;
    }
    return iconNode;
  };

  getNoteField = () => {
    const {
      student,
      saveAction,
      action: { type },
    } = this.props;
    const { note } = this.state;

    if (!saveAction) {
      return <ActionNote>{note}</ActionNote>;
    }

    let placeholderText = "";
    if (!note) {
      switch (type) {
        case "call":
          placeholderText = `I called home about...?`;
          break;
        case "message":
          placeholderText = `I sent an email to ${student.first_name}'s other teachers about...`;
          break;
        default:
          placeholderText = `Today, I noticed ${student.first_name} was really good at...`;
      }
    }

    return (
      <ActionTextArea
        name="ActionTextArea"
        onChange={this.handleNoteUpdate}
        rows="10"
        error={!!this.state.noteError}
        placeholder={placeholderText}
        value={note}
      />
    );
  };

  getActionCopy = () => {
    const { student, saveAction } = this.props;

    if (!saveAction) {
      return null;
    }
    return `What's the latest on ${student.first_name}?`;
  };

  getDate = date => {
    if (isToday(date)) {
      return "Today";
    } else if (isYesterday(date)) {
      return "Yesterday";
    } else if (isAfter(date, subDays(new Date(), 7))) {
      // Figure if it's within the last week we can helpfully use the name of the day.
      return format(date, "dddd [the] Do");
    } else {
      return format(date, "MM/DD/YYYY");
    }
  };

  getContextDeltasOrEmptyState = () => {
    const { contextDeltas, action, showContextSection } = this.props;

    if (!showContextSection) {
      return null;
    }

    if (!contextDeltas || !contextDeltas.length) {
      if (action.id || typeof contextDeltas === "undefined") {
        // The action's either been saved with no deltas, so this section should be blank, or
        // context deltas weren't even offered, so this section should be blank.
        return null;
      } else {
        // The action's not been saved, which means this is just the context empty state.
        return (
          <ActionContextPanel>
            <ContextHeading>Context</ContextHeading>
            <ContextHr />
            <ContextPoseGroup>
              <PosedParagraph key="emptyState">
                Select deltas to save them as context for this action
              </PosedParagraph>
            </ContextPoseGroup>
          </ActionContextPanel>
        );
      }
    }

    return (
      <ActionContextPanel>
        <ContextHeading>Context</ContextHeading>
        <ContextHr />
        <ContextPoseGroup>
          {map(contextDeltas, (delta, i) => {
            return <PosedContextDelta delta={delta} key={i} />;
          })}
        </ContextPoseGroup>
      </ActionContextPanel>
    );
  };

  render() {
    const {
      student,
      showTitle,
      saveAction,
      deleteAction,
      closeActionForm,
      reminderButtonCopy,
      action: { completed_on: completedOn, due_on: dueOn },
    } = this.props;

    return (
      <ActionCardContainer>
        <ActionHeading>
          {this.getActionIcon()}
          {showTitle ? (
            <StudentHeading>
              {student.first_name} {student.last_name[0]}
            </StudentHeading>
          ) : null}
          {deleteAction ? <DeleteIcon className="fas fa-trash" onClick={deleteAction} /> : null}
          {closeActionForm ? (
            <CloseIcon className="fas fa-times" onClick={closeActionForm} />
          ) : null}
        </ActionHeading>
        <ActionBody>
          <ActionLeftPanel>
            <ActionCopy>{this.getActionCopy()}</ActionCopy>
            <ActionTextAreaContainer>{this.getNoteField()}</ActionTextAreaContainer>
            <ErrorField visible={this.state.noteError}>
              Please add a note describing the action you're taking{" "}
              <span role="img" aria-label="pointing up at note field">
                👆
              </span>
            </ErrorField>
            <ActionButtonGroup visible={!!saveAction}>
              <Button onClick={this.handleFormSubmission.bind(this, true, null)} primary>
                Save
              </Button>
              <Divider>or</Divider>
              {this.state.pose === "hideReminders" ? (
                <Button onClick={this.showReminders}>{reminderButtonCopy}</Button>
              ) : null}
              {this.getReminderButtons()}
            </ActionButtonGroup>
          </ActionLeftPanel>
          {this.getContextDeltasOrEmptyState()}
        </ActionBody>
        <ActionFooter>
          <ActionDate visible={!!dueOn}>
            <label>Due: </label>
            {this.getDate(dueOn)}
          </ActionDate>
          <ActionDate visible={!!completedOn}>
            <label>Completed: </label>
            {this.getDate(completedOn)}
          </ActionDate>
        </ActionFooter>
      </ActionCardContainer>
    );
  }
}

ActionCard.defaultProps = {
  action: {
    note: "",
    type: "note",
  },
};

export default ActionCard;
