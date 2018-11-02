import React from 'react';
import styled from 'styled-components';
import {
  colors,
  effects,
} from './constants';
import {
  ActionIconList,
  Button,
} from '.';

const ActionFormContainer = styled.section`
  width: calc(100% - 50px);
  min-height: 160px;
  margin: 10px;
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
  font-size: 18px;
  margin: 0;
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
  visibility: ${({visible}) => {return visible ? 'visible' : 'hidden'}}
`;

class ActionForm extends React.Component {
  state = {
    type: 'note',
    note: '',
    noteError: false,
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

  handleFormSubmission = () => {
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
    }).then((resp) => {
      if (resp.status === 201) {
        closeActionForm();
      }
    });
  }

  getType = () => {
    return this.props.parentManagedType || this.state.type;
  }

  render() {
    const { student, closeActionForm, parentManagedType } = this.props;
    const type = this.getType();

    let placeholderText = "";
    switch (type) {
      case 'call':
        placeholderText = `What are the details of the call you want to log?`;
        break;
      case 'message':
        placeholderText = `What are the details of the message you sent?`;
        break;
      default:
        placeholderText = `Take a note about ${student.first_name}`;
    }

    return (
      <ActionFormContainer>
        <CloseIcon className="fas fa-times" onClick={closeActionForm}/>
        <div style={{display: parentManagedType ? 'none' : 'initial', margin: '15px 0px'}}>
          <Heading>What kind of action do you want to record for {student.first_name}:</Heading>
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
        <Button onClick={this.handleFormSubmission} primary>
          Save Now
        </Button>
      </ActionFormContainer>
    );
  }
}


export default ActionForm;