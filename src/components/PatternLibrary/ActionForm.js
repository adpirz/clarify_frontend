import React from 'react';
import styled from 'styled-components';
import {
  colors,
  effects,
} from './constants';
import {
  ActionIcon,
  ActionIconImage,
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

const ActionIconList = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 35%;
  margin: 15px 0px;
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

const Caret = styled.div`
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-top: 15px solid ${colors.accent};
  width: 0;
  height: 0;
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
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

  handleActionTypeSelection = (type) => {
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
    const { type, note } = this.state;
    if (!note) {
      this.setState({noteError: true});
      return;
    }
    const { createAction, student: {id: studentId}} = this.props;
    createAction({
      type,
      note,
      studentId,
    }).then((resp) => {
      if (resp.status === 201) {
        this.props.closeActionForm();
      }
    });
  }

  render() {
    const { student, closeActionForm } = this.props;
    const { type } = this.state;


    let placeholderText = "";
    switch (type) {
      case 'call':
        placeholderText = `What do you want to remember about this phone call?`
        break;
      case 'message':
        placeholderText = `What do you want to remember about the message you sent?`
        break;
      default:
        placeholderText = `Take a note about ${student.first_name}`
    }

    return (
      <ActionFormContainer>
        <CloseIcon className="fas fa-times" onClick={closeActionForm}/>
        <Heading>What kind of action do you want to record for {student.first_name}:</Heading>
        <ActionIconList>
          <ActionIconImage
            selected={type === 'note'}
            onClick={this.handleActionTypeSelection.bind(this, 'note')}
            imageFileName="note_icon.png"
            actionAlt="Make a Note icon">
            {type === 'note' ? <Caret /> : null}
          </ActionIconImage>
          <ActionIcon
            selected={type === 'call'}
            onClick={this.handleActionTypeSelection.bind(this, 'call')}
            className="fa-phone">
            {type === 'call' ? <Caret /> : null}
          </ActionIcon>
          <ActionIcon
            selected={type === 'message'}
            onClick={this.handleActionTypeSelection.bind(this, 'message')}
            className="fa-comment-alt">
            {type === 'message' ? <Caret /> : null}
          </ActionIcon>
        </ActionIconList>
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
          Please add a note describing the action you're taking <span role="img" aria-label="pointing up at note field"></span>👆
        </ErrorField>
        <Button onClick={this.handleFormSubmission} primary>
          Save Now
        </Button>
      </ActionFormContainer>
    );
  }
}


export default ActionForm;