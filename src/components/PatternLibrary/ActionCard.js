import React from 'react';
import styled from 'styled-components';
import {
  effects,
  colors,
} from './constants';

const CardContainer = styled.div`
  min-height: 120px;
  margin: 10px;
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

const ActionIconContainer = styled.div`
  padding: 10px;
  box-shadow: 0px 0px 2px #888;
  border-radius: 50%;
  display: flex;
  background-color: ${colors.accent};
`;

const ActionIcon = styled.i`
  font-size: 40px;
`;

const ActionImage = styled.img`
  width: 49px;
  height: 39px;
`;

const ActionNote = styled.div`
  margin: 10px 25px;
`;


class ActionCard extends React.Component {
  getActionIcon = (type) => {
    let iconNode = null;
    switch (type) {
      case 'call':
        iconNode = (
          <ActionIcon className="fas fa-phone" />
        )
        break;
      case 'message':
        iconNode = (
          <ActionIcon className="fas fa-comment-alt" />
        )
        break;
      default:
        iconNode = (
          <ActionImage
            src="../note_icon.png"
            alt="Make a Note icon" />
          );
    }

    return (
      <ActionIconContainer>
        {iconNode}
      </ActionIconContainer>
    );
  }

  render() {
      const { action, handleActionFormClick, className } = this.props;

      if (!action) {
        return (
          <CardContainer onClick={handleActionFormClick} className={className}>
            Log your first action!
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