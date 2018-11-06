import React from 'react';
import styled from 'styled-components';

import { colors } from './constants'


const ActionIconContainer = styled.div`
  padding: 15px;
  box-shadow: 0px 0px 2px #888;
  border-radius: 50%;
  color: ${colors.black};
  cursor: ${({selected}) => { return typeof(selected) === 'undefined' ? 'initial' : 'pointer'}};
  background-color: ${({selected}) => { return typeof(selected) === 'undefined' || selected === true ? colors.accent : colors.white} };
  position: relative;

  &:hover {
    opacity: ${({selected}) => { return typeof(selected) === 'undefined' || selected === true ? 1 : .5} };
  }
`;

const ActionI = styled.i`
  font-size: 35px;
`;

const ActionIconImg = styled.img`
  width: 49px;
  height: 39px;
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


const ActionIconImage = ({ imageFileName, actionAlt, children, selected, onClick }) => (
  <ActionIconContainer selected={selected} onClick={onClick}>
    <ActionIconImg
      src={`/${imageFileName}`}
      actionAlt={actionAlt} />
    {selected ? <Caret /> : null}
  </ActionIconContainer>
);

const ActionIcon = ({ className, selected, onClick, children }) => (
  <ActionIconContainer selected={selected} onClick={onClick}>
    <ActionI className={`fas ${className}`} />
    {selected ? <Caret /> : null}
  </ActionIconContainer>
);

const ActionIconList = ({type, handleTypeSelection}) => {
  return (
    <ActionIconListDiv>
      <ActionIconImage
        selected={type === 'note'}
        onClick={handleTypeSelection.bind(this, 'note')}
        imageFileName="note_icon.png"
        actionAlt="Make a Note icon">
      </ActionIconImage>
      <ActionIcon
        selected={type === 'call'}
        onClick={handleTypeSelection.bind(this, 'call')}
        className="fa-phone">
      </ActionIcon>
      <ActionIcon
        selected={type === 'message'}
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