import React from 'react';
import styled from 'styled-components';
import colors from '../colors.js';
import { fonts } from '../constants.js';

const ErrorDiv = styled.div`
  background-color: ${colors.errorOrange};
  color: ${colors.black};
  font-size: ${fonts.small};
  font-weight: bold;
  padding: 10px 0px;
  margin: 15px auto;
  text-align: center;
  width: 100%;
`;

const Error = ({children}) => {
  if (!children) {
    return null;
  }
  return (
    <ErrorDiv>
      {children}
    </ErrorDiv>
  )
}

export default Error;