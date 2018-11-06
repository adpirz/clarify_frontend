import React from 'react';
import styled from 'styled-components';
import { effects } from './constants';
import {
  ActionIcon,
  ActionIconImage,
} from '.';

const CardContainer = styled.div`
  min-height: 120px;
  margin: 25px auto;
  box-shadow: ${effects.cardBoxShadow};
  border-radius: 20px;
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  padding: 15px;
  width: 50%;
  position: relative;

  &:hover {
    box-shadow: ${effects.cardBoxShadowHover};
  }
`;

const ActionNote = styled.div`
  margin: 10px 25px;
`;


class ActionCard extends React.Component {
  getActionIcon = (type) => {
    let iconNode = null;
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

  render() {
      const { action, handleActionFormClick, className, firstName } = this.props;

      if (!action) {
        return (
          <CardContainer onClick={handleActionFormClick} className={className}>
            Log your first action for {firstName}!
          </CardContainer>
        )
      }
      return (
        <CardContainer className={className}>
          {this.getActionIcon(action.type)}
          <ActionNote>
            {action.note}
          </ActionNote>
        </CardContainer>
      )
  }
}


export default ActionCard;