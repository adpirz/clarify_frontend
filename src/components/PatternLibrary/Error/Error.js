import React from 'react';
import styled from 'styled-components';
import {
  fonts,
  colors,
} from '../constants';

const ErrorDiv = styled.div`
  color: ${colors.errorOrange};
  font-size: ${fonts.small};
  font-weight: bold;
  padding: 15px 15px;
  margin: 15px auto;
  text-align: center;
  width: auto;
`;

const Error = ({children}) => {
  if (!children || !children.length) {
    return null;
  }
  return (
    <ErrorDiv>
      {children}
    </ErrorDiv>
  )
}

export default Error;