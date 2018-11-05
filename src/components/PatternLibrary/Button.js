import React from 'react';
import styled from 'styled-components';
import darken from 'polished/lib/color/darken';
import {
  colors,
  fontFamilies
} from './constants';


const ThemedButton = styled.button`
  background-color: ${props => props.primary ? colors.primaryPink : colors.secondaryMidnightBlue};
  color: ${props => props.primary ? colors.white : colors.white};
  font-size: 1.5em;
  border: 2px solid ${colors.black};
  border-radius: 8px;
  cursor: pointer;
  min-width: 150px;
  display: inline-block;
  font-family: ${fontFamilies.base};

  &:hover {
    background: ${(props) => darken(.1, props.primary ? colors.primaryPink : colors.secondaryMidnightBlue) };
  }
`;


const Button = (props) => {
  const { children, className, primary, onClick } = props;
  return (
    <ThemedButton className={className} primary={primary} onClick={onClick}>
      {children}
    </ThemedButton>
  )
}

export default Button;