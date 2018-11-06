import React from 'react';
import styled from 'styled-components';
import map from 'lodash/map';
import get from 'lodash/get';
import posed from 'react-pose';
import isToday from 'date-fns/is_today';
import isYesterday from 'date-fns/is_yesterday';
import isAfter from 'date-fns/is_after';
import subDays from 'date-fns/sub_days';
import format from 'date-fns/format';

import {
  colors,
  effects,
  fontSizes
} from './constants';
import {
  ActionTextArea,
  ActionIcon,
  ActionIconImage,
  Button,
} from '.';
import {
  getReminders
} from '../../utils';

const ActionCardContainer = styled.section`
  width: calc(80% - 50px);
  min-height: 160px;
  margin: 10px auto;
  padding: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: ${colors.backgroundAccent};
  position: relative;
  box-shadow: ${effects.cardBoxShadow};
  color: ${colors.black};
`;

const ActionCardHeading = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
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

const ActionTextAreaContainer = styled.div`
  width: 80%;
  display: flex;
  align-items: top;
`;

const ErrorField = styled.h4`
  color: ${colors.errorOrange};
  margin: ${({visible}) => {return visible ? '10px 0px;' : '0px;'}}
  visibility: ${({visible}) => {return visible ? 'visible;' : 'hidden'}}
`;

const ActionButtons = styled.div`
  display: ${({visible}) => {return visible ? 'flex;' : 'none;'}};
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
`;

const Divider = styled.span`
  margin: 15px 0px;
`;

const ReminderList = styled(posed.ul({
  showReminders: {
    opacity: 1,
    transition: {
      duration: 3000,
    },
    staggerChildren: 200
  },
  hideReminders: { opacity: 0 },
}))`
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

const ActionDateWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
`;

const ActionDate = styled.p`
  opacity: .5;
  font-size: ${fontSizes.medium};
  display: ${({visible}) => { return visible ? 'block;' : 'none;'}}
`;


const REMINDERS = getReminders();

class ActionCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      noteError: false,
      pose: 'hideReminders',
      note: props.action.note || "",
    };
  }

  componentWillReceiveProps(nextProps) {
    const oldNote = get(this.props, 'action.note');
    const newNote = get(nextProps, 'action.note');
    if (newNote && oldNote !== newNote) {
      this.setState({note: newNote});
    }
  }

  handleNoteUpdate = (e) => {
    const newText = e.target.value;
    if (newText) {
      this.setState({noteError: false});
    }
    this.setState({note: newText});
  }

  showReminders = () => {
    this.setState({pose: 'showReminders'})
  }

  handleFormSubmission = (completed = false, dueOn = null) => {
    const { note } = this.state;
    if (!note) {
      this.setState({noteError: true});
      return;
    }
    const { closeActionForm, saveAction, type, student: { id: studentId }, action: { id } } = this.props;
    const actionPayload = {
      type,
      note,
      studentId,
      dueOn,
      completed,
      actionId: id,
    }
    saveAction(actionPayload).then((resp) => {
      if (resp.status === 201 && closeActionForm) {
        closeActionForm();
      }
    });

  }

  getReminderButtons = () => {
    return (
      <ReminderList pose={this.state.pose} style={{display: this.state.pose === 'hideReminders' ? 'none' : 'inline-flex'}}>
        {map(REMINDERS, (r, i) => {
          return (
            <ReminderOption
              onClick={this.handleFormSubmission.bind(this, false, r.reminderDate)}
              key={i}>
              {r.copy}
            </ReminderOption>
          )
        })}
      </ReminderList>
    );
  }

  getActionIcon = () => {
    const { action: { id, type }} = this.props;
    let iconNode = null;
    if (!id) {
      return null;
    }
    switch (type) {
      case 'call':
        iconNode = <ActionIcon className='fa-phone' />
        break;
      case 'message':
        iconNode = <ActionIcon className='fa-comment-alt' />
        break;
      default:
        iconNode = (
          <ActionIconImage
            imageFileName="note_icon.png"
            actionAlt="Make a Note icon" />
          );
    }
    return iconNode;
  }

  getNoteField = () => {
    const { studentFirstName, saveAction, action: { type } } = this.props;
    const { note } = this.state;

    if (!saveAction) {
      return (
        <ActionNote>
          { note }
        </ActionNote>
      )
    }

    let placeholderText = "";
    if (!note) {
      switch (type) {
        case 'call':
          placeholderText = `I called home about...?`;
          break;
        case 'message':
          placeholderText = `I sent an email to ${studentFirstName}'s other teachers about...`;
          break;
        default:
          placeholderText = `Today, I noticed ${studentFirstName} was really good at...`;
      }
    }

    return (
      <ActionTextArea
        name="ActionTextArea"
        onChange={this.handleNoteUpdate}
        rows="10"
        error={!!this.state.noteError}
        placeholder={placeholderText}
        value={note}/>
    )
  }

  getDate = (date) => {

    if (isToday(date)) {
      return "Today";
    } else if (isYesterday(date)) {
      return "Yesterday";
    } else if (isAfter(date, subDays(new Date(), 7))) {
      // Figure if it's within the last week we can helpfully use the name of the day.
      return format(date, 'dddd [the] Do');
    } else {
      return format(date, 'MM/DD/YYYY');
    }
  }

  render() {
    const { student, saveAction, deleteAction, closeActionForm, action: { completed_on: completedOn, due_on: dueOn }  } = this.props;

    return (
      <ActionCardContainer>
        <ActionCardHeading>
          {this.getActionIcon()}
          {student ? <StudentHeading>{student.first_name} {student.last_name[0]}</StudentHeading> : null}
          {deleteAction ? <DeleteIcon className="fas fa-trash" onClick={deleteAction} /> : null}
          {closeActionForm ? <CloseIcon className="fas fa-times" onClick={closeActionForm} /> : null}
        </ActionCardHeading>
        <ActionTextAreaContainer>
          {this.getNoteField()}
        </ActionTextAreaContainer>
        <ErrorField visible={this.state.noteError}>
          Please add a note describing the action you're taking <span role="img" aria-label="pointing up at note field">👆</span>
        </ErrorField>
        <ActionButtons visible={!!saveAction}>
          <Button onClick={this.handleFormSubmission.bind(this, true, null)} primary>
            Save Now
          </Button>
          <Divider>
            -- or --
          </Divider>
          { this.state.pose === 'hideReminders' ?
            <Button onClick={this.showReminders}>
              Remind Me
            </Button> : null
          }
          {this.getReminderButtons()}
        </ActionButtons>
        <ActionDateWrapper>
          <ActionDate visible={!!dueOn}>
            <label>Due: </label>
            {this.getDate(dueOn)}
          </ActionDate>
          <ActionDate visible={!!completedOn}>
            <label>Completed: </label>
            {this.getDate(completedOn)}
          </ActionDate>
        </ActionDateWrapper>
      </ActionCardContainer>
    );
  }
}

ActionCard.defaultProps = {
  action: {
    note: "",
    type: "note"
  },
}


export default ActionCard;