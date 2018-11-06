import React from 'react';
import styled from 'styled-components';

import { colors } from './constants'


const ActionIconContainer = styled.div`
  display: inline-block;
  padding: 10px;
  box-shadow: 0px 0px 2px #888;
  border-radius: 50%;
  color: ${colors.black};
  cursor: ${({isSelected}) => { return typeof(isSelected) === 'undefined' ? 'initial' : 'pointer'}};
  background-color: ${({isSelected}) => { return typeof(isSelected) === 'undefined' || isSelected === true ? colors.accent : colors.white} };
  position: relative;

  &:hover {
    opacity: ${({isSelected}) => { return typeof(isSelected) === 'undefined' || isSelected === true ? 1 : .5} };
  }
`;

const ActionI = styled.i`
  font-size: 30px;
`;

const ActionIconImg = styled.img`
  width: 40px;
  height: 32px;
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

const ActionIconListDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;


const ActionIconImage = ({ imageFileName, actionAlt, children, isSelected, onClick }) => (
  <ActionIconContainer isSelected={isSelected} onClick={onClick}>
    <ActionIconImg
      src={`/${imageFileName}`}
      actionAlt={actionAlt} />
    {isSelected ? <Caret /> : null}
  </ActionIconContainer>
);

const ActionIcon = ({ className, isSelected, onClick, children }) => (
  <ActionIconContainer isSelected={isSelected} onClick={onClick}>
    <ActionI className={`fas ${className}`} />
    {isSelected ? <Caret /> : null}
  </ActionIconContainer>
);

const ActionIconList = ({type, handleTypeSelection, className, isSelected}) => {
  return (
    <ActionIconListDiv className={className}>
      <ActionIconImage
        isSelected={isSelected && type === 'note'}
        onClick={handleTypeSelection.bind(this, 'note')}
        imageFileName="note_icon.png"
        actionAlt="Make a Note icon">
      </ActionIconImage>
      <ActionIcon
        isSelected={isSelected && type === 'call'}
        onClick={handleTypeSelection.bind(this, 'call')}
        className="fa-phone">
      </ActionIcon>
      <ActionIcon
        isSelected={isSelected && type === 'message'}
        onClick={handleTypeSelection.bind(this, 'message')}
        className="fa-comment-alt">
      </ActionIcon>
    </ActionIconListDiv>
  );
}


export {
  ActionIcon,
  ActionIconImage,
  ActionIconList,
};