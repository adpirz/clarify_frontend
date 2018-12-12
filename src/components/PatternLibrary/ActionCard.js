import React from "react";
import styled from "styled-components";
import map from "lodash/map";
import get from "lodash/get";
import { NavLink } from "react-router-dom";
import posed, { PoseGroup } from "react-pose";
import isToday from "date-fns/is_today";
import isYesterday from "date-fns/is_yesterday";
import isAfter from "date-fns/is_after";
import subDays from "date-fns/sub_days";
import format from "date-fns/format";

import { colors, effects, fontSizes } from "./constants";
import { ActionTextArea, ActionIcon, ActionIconImage, Button } from ".";
import { getReminders } from "../../utils";
import { DataConsumer } from "../../DataProvider";

var ContextDelta = require("./DeltaContainer").ContextDelta;

const ActionCardContainer = styled.section`
  width: calc(90% - 50px);
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
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
`;

const ActionCopy = styled.p`
  font-size: ${fontSizes.medium};
  margin: 0 0 20px 0;
`;

const ActionBody = styled.section`
  display: flex;
  justify-content: center;
  margin: 10px;
  width: 100%;
`;

const StudentHeading = styled.h2`
  font-size: ${fontSizes.large};
  margin-left: 25px;
`;

const ActionIcons = styled.div`
  display: flex;
  width: 75px;
  justify-content: flex-end;
  align-items: center;
  flex-grow: 1;
`;

const BaseIcon = styled.i`
  font-size: ${fontSizes.medium};
  cursor: pointer;
  margin: 0px 10px;
`;

const IconNavLink = styled(NavLink)`
  color: ${colors.black};
`;

const DeleteIcon = styled(BaseIcon)``;

const CloseIcon = styled(BaseIcon)`
  font-size: ${fontSizes.large};
  line-height: ${fontSizes.large};
`;

const EditIcon = styled(BaseIcon)`
  text-decoration: none;
  color: black;
`;

const ActionLeftPanel = styled.section`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const ActionContextPanel = styled.section`
  width: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 20px;
`;

const PosedParagraph = posed.p();

const ContextHeading = styled.h3`
  font-size: ${fontSizes.large};
  margin: 0;
  font-weight: 400;
`;

const ContextPoseGroup = styled(PoseGroup)`
  overflow: visible;
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
  },
});

const ActionTextAreaContainer = styled.div`
  display: flex;
  background-color: ${colors.white};
  border-radius: 10px;
  padding: 10px;
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
  display: flex;
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
  margin: 0;
  min-height: 75px;
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

const AudienceGroup = styled.div`
  display: flex;
  align-items: center;
  margin: 0 15px;
`;

const ToggleGroup = styled.div`
  display: flex;
  border: 1px solid ${colors.black};
  border-radius: 15px;
  padding: 5px;
  margin: 0px 5px;
`;

const Toggle = styled.input`
  margin: 0px 10px;
`;

const ActionAudience = styled(ActionDate)``;

const REMINDERS = getReminders();

class ActionCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      noteError: false,
      pose: "hideReminders",
      note: props.action.note,
      audience: "public",
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
    const { note, audience } = this.state;
    if (!note) {
      this.setState({ noteError: true });
      return;
    }
    const {
      doneEditingRoute,
      closeActionForm,
      saveAction,
      type,
      student: { id: studentID },
      action,
      contextDeltas,
    } = this.props;
    const actionPayload = {
      type: type || action.type,
      note,
      studentID,
      dueOn,
      completed,
      deltaIDs: map(contextDeltas, "delta_id"),
      audience,
    };

    if (action && action.id) {
      actionPayload.actionID = action.id;
    }
    saveAction(actionPayload).then(resp => {
      if (resp.status === 201 || resp.status === 200) {
        if (doneEditingRoute) {
          this.props.push(doneEditingRoute);
        } else if (closeActionForm) {
          closeActionForm();
        }
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
    const { student, type, inEditMode } = this.props;
    const { note } = this.state;
    let noteNode = null;
    if (!inEditMode) {
      noteNode = <ActionNote>{note}</ActionNote>;
    } else {
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

      noteNode = (
        <ActionTextArea
          name="ActionTextArea"
          onChange={this.handleNoteUpdate}
          rows="10"
          error={!!this.state.noteError}
          placeholder={placeholderText}
          value={note}
        />
      );
    }

    return <ActionTextAreaContainer>{noteNode}</ActionTextAreaContainer>;
  };

  getActionCopy = () => {
    const { student, inEditMode } = this.props;

    if (!inEditMode) {
      return null;
    }
    return <ActionCopy>What's the latest on {student.first_name}?</ActionCopy>;
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

  selectAudience = audience => {
    this.setState({ audience });
  };

  getPublicPrivateToggle = () => {
    if (!this.props.user.sis_enabled) {
      return null;
    }
    // Because there can be multiple ActionCards on the page, we need a unique name for the radio
    // buttons to work correctly
    const radioName = `audience-${this.props.student.id}`;

    return (
      <AudienceGroup>
        <label htmlFor="public">Public</label>
        <ToggleGroup>
          <Toggle
            type="radio"
            id="public"
            name={radioName}
            value="public"
            checked={this.state.audience === "public"}
            onChange={this.selectAudience.bind(this, "public")}
          />
          <Toggle
            type="radio"
            id="private"
            name={radioName}
            value="private"
            checked={this.state.audience === "private"}
            onChange={this.selectAudience.bind(this, "private")}
          />
        </ToggleGroup>
        <label htmlFor="private">Private</label>
      </AudienceGroup>
    );
  };

  getCreatedByLabel = () => {
    if (!this.props.action.id) {
      return null;
    }
    const {
      action: {
        created_by: {
          user_profile_id: createdById = null,
          first_name: firstName,
          last_name: lastName,
        },
        public: audienceIsPublic,
      },
      user,
    } = this.props;
    let label = "";
    if (createdById === user.user_profile_id) {
      label = `You (${audienceIsPublic ? "Public" : "Private"})`;
    } else {
      label = `${firstName[0]}. ${lastName}`;
    }
    return <ActionAudience visible>Created By: {label}</ActionAudience>;
  };

  getActionButtonGroup = () => {
    const { reminderButtonCopy, inEditMode } = this.props;
    if (!inEditMode) {
      return null;
    }
    return (
      <ActionButtonGroup>
        {this.getPublicPrivateToggle()}
        <Button onClick={this.handleFormSubmission.bind(this, true, null)} primary>
          Save
        </Button>
        <Divider>or</Divider>
        {this.state.pose === "hideReminders" ? (
          <Button onClick={this.showReminders}>{reminderButtonCopy}</Button>
        ) : null}
        {this.getReminderButtons()}
      </ActionButtonGroup>
    );
  };

  getErrorField = () => {
    if (!this.state.noteError) {
      return null;
    }
    return (
      <ErrorField visible={this.state.noteError}>
        Please add a note describing the action you're taking{" "}
        <span role="img" aria-label="pointing up at note field">
          👆
        </span>
      </ErrorField>
    );
  };

  getCloseIcon = () => {
    const { inEditMode, doneEditingRoute, closeActionForm } = this.props;
    if (!inEditMode) {
      return null;
    }

    if (doneEditingRoute) {
      return (
        <IconNavLink to={doneEditingRoute}>
          <CloseIcon className="fas fa-times" alt="Close Form Icon" />
        </IconNavLink>
      );
    } else if (closeActionForm) {
      return <CloseIcon onClick={closeActionForm} className="fas fa-times" alt="Close Form Icon" />;
    }
  };

  render() {
    const {
      student,
      showTitle,
      deleteAction,
      action: { completed_on: completedOn, due_on: dueOn, id: actionID, created_by: createdBy },
      user: currentUserProfile,
      editRoute,
      inEditMode,
    } = this.props;

    const userIsAuthor =
      actionID && get(createdBy, "user_profile_id") === get(currentUserProfile, "user_profile_id");

    return (
      <ActionCardContainer>
        <ActionHeading>
          {this.getActionIcon()}
          {showTitle ? (
            <StudentHeading>
              {student.first_name} {student.last_name[0]}
            </StudentHeading>
          ) : null}
          <ActionIcons>
            {actionID && userIsAuthor ? (
              <DeleteIcon
                className="fas fa-trash"
                onClick={deleteAction.bind(this, actionID)}
                alt="Delete Icon"
              />
            ) : null}
            {actionID && userIsAuthor && !inEditMode ? (
              <IconNavLink to={editRoute}>
                <EditIcon className="fas fa-edit" />
              </IconNavLink>
            ) : null}
            {this.getCloseIcon()}
          </ActionIcons>
        </ActionHeading>
        <ActionBody>
          <ActionLeftPanel>
            {this.getActionCopy()}
            {this.getNoteField()}
            {this.getErrorField()}
            {this.getActionButtonGroup()}
          </ActionLeftPanel>
          {this.getContextDeltasOrEmptyState()}
        </ActionBody>
        <ActionFooter>
          {this.getCreatedByLabel()}
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

export default props => (
  <DataConsumer>
    {({ user, deleteAction, saveAction }) => (
      <ActionCard {...props} user={user} deleteAction={deleteAction} saveAction={saveAction} />
    )}
  </DataConsumer>
);
