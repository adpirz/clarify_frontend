import React from 'react';
import styled from 'styled-components';
import map from 'lodash/map';
import posed from 'react-pose';
import format from 'date-fns/format';

import {
  colors,
  effects,
  fontSizes
} from './constants';
import {
  ActionIconList,
  Button,
} from '.';
import {
  getReminders
} from '../../utils';

const ActionFormContainer = styled.section`
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
`;

const Heading = styled.h3`
  font-size: ${fontSizes.large};
`;

const CloseIcon = styled.i`
  position: absolute;
  font-size: 18px;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;

const ActionTextAreaContainer = styled.div`
  width: 50vw;
`;

const ActionTextArea = styled.textarea`
  width: 100%;
  border: ${({error}) => {return error ? `1px solid ${colors.errorOrange}` : 'none'}};
`;

const ErrorField = styled.h4`
  color: ${colors.errorOrange};
  visibility: ${({visible}) => {return visible ? 'visible;' : 'hidden;'}}
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
`;

const Divider = styled.span`
  color: ${colors.black};
  margin: 20px 15px;
`;

const ReminderButtonDiv = posed.div({
  showReminders: { display: 'none' },
  hideReminders: { display: 'block' }
});

const ReminderList = styled(posed.ul({
  showReminders: { opacity: 1 },
  hideReminders: { opacity: 0 },
}))`
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
`;

const ReminderOption = styled(posed.li({
  visible: {
    opacity: 1,
    transition: ({ key }) => ({ delay: key * 50 })
  },
  props: { key: 0 }
}))`
  border: 1px solid ${colors.borderGrey};
  background: ${colors.white};
  font-size: ${fontSizes.small};
  margin: 8px 5px;
  padding: 5px 8px;
  cursor: pointer;
`;

const REMINDERS = getReminders();

class ActionForm extends React.Component {
  state = {
    type: 'note',
    note: '',
    noteError: false,
    pose: 'hideReminders',
  }

  handleTypeSelection = (type) => {
    this.setState({
      type,
    });
  }

  handleNoteUpdate = (e) => {
    const newText = e.target.value;
    if (newText) {
      this.setState({noteError: false});
    }
    this.setState({note: newText});
  }

  handleFormSubmission = (completed = true, reminderDate = null) => {
    const { note } = this.state;
    if (!note) {
      this.setState({noteError: true});
      return;
    }
    const { closeActionForm, createAction, student: {id: studentId}} = this.props;
    const type = this.getType();
    createAction({
      type,
      note,
      studentId,
      completedOn: completed ? format(new Date(), 'MM/DD/YYYY HH:mm') : null,
      dueOn: reminderDate ? format(reminderDate, 'MM/DD/YYYY HH:mm') : null,
    }).then((resp) => {
      if (resp.status === 201) {
        closeActionForm();
      }
    });
  }

  getType = () => {
    return this.props.parentManagedType || this.state.type;
  }

  showReminders = () => {
    this.setState({pose: 'showReminders'})
  }

  getReminderButtons = () => {
    return (
      <ReminderList pose={this.state.pose}>
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

  render() {
    const { student, closeActionForm, parentManagedType } = this.props;
    const type = this.getType();

    let placeholderText = "";
    switch (type) {
      case 'call':
        placeholderText = `I called home about...?`;
        break;
      case 'message':
        placeholderText = `I sent an email to ${student.first_name}'s other teachers about...`;
        break;
      default:
        placeholderText = `Today, I noticed ${student.first_name} was really good at...`;
    }

    return (
      <ActionFormContainer>
        <CloseIcon className="fas fa-times" onClick={closeActionForm}/>
        <div style={{display: parentManagedType ? 'none' : 'initial', margin: '15px 0px'}}>
          <Heading>What kind of action will this be?</Heading>
          <ActionIconList type={type} handleTypeSelection={this.handleTypeSelection}/>
        </div>
        <ActionTextAreaContainer>
          <ActionTextArea
            onChange={this.handleNoteUpdate}
            name="action-note"
            rows="10"
            error={!!this.state.noteError}
            placeholder={placeholderText}>
          </ActionTextArea>
        </ActionTextAreaContainer>
        <ErrorField visible={this.state.noteError}>
          Please add a note describing the action you're taking <span role="img" aria-label="pointing up at note field">👆</span>
        </ErrorField>
        <ActionButtons>
          <Button onClick={this.handleFormSubmission.bind(this, true, null)} primary>
            Save Now
          </Button>
          <Divider>
            -- or --
          </Divider>
          <ReminderButtonDiv pose={this.state.pose}>
            <Button onClick={this.showReminders}>
              Remind Me
            </Button>
          </ReminderButtonDiv>
          {this.getReminderButtons()}
        </ActionButtons>
      </ActionFormContainer>
    );
  }
}


export default ActionForm;