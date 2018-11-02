import React from 'react';
import styled from 'styled-components';

import { colors } from './constants'


const ActionIconContainer = styled.div`
  padding: 20px;
  box-shadow: 0px 0px 2px #888;
  border-radius: 50%;
  display: flex;
  cursor: ${({selected}) => { return typeof(selected) === 'undefined' ? 'initial' : 'pointer'}};
  background-color: ${({selected}) => { return typeof(selected) === 'undefined' || selected === true ? colors.accent : 'transparent'} };
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



const ActionIconImage = ({ imageFileName, actionAlt, children, selected, onClick }) => (
  <ActionIconContainer selected={selected} onClick={onClick}>
    <ActionIconImg
      src={`/${imageFileName}`}
      actionAlt={actionAlt} />
    {children}
  </ActionIconContainer>
);

const ActionIcon = ({ className, selected, onClick, children }) => (
  <ActionIconContainer selected={selected} onClick={onClick}>
    <ActionI className={`fas ${className}`} />
      {children}
  </ActionIconContainer>
);


export {
  ActionIcon,
  ActionIconImage,
};