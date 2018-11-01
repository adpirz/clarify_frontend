import React from 'react';
import styled from 'styled-components';
import darken from 'polished/lib/color/darken';
import { colors } from './constants';

const ThemedButton = styled.button`
  background-color: ${props => props.primary ? colors.primaryPink : colors.white};
  color: ${props => props.primary ? colors.white : colors.black};
  font-size: 1.5em;
  border: 2px solid ${colors.black};
  border-radius: 8px;
  cursor: pointer;
  min-width: 150px;
  display: inline-block;

  &:hover {
    background: ${(props) => darken(.1, props.primary ? colors.primaryPink : colors.white) };
  }
`;

const Button = ({children, className, primary, onClick}) => {
  return (
    <ThemedButton className={className} primary={primary} onClick={onClick}>
      {children}
    </ThemedButton>
  )
}

export default Button;