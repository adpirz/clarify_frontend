import React from "react";
import styled from "styled-components";
import darken from "polished/lib/color/darken";
import { colors, fontFamilies } from "./constants";

const ThemedButton = styled.button`
  background-color: ${props => (props.primary ? colors.primaryPink : colors.secondaryMidnightBlue)};
  color: ${props => (props.primary ? colors.white : colors.white)};
  font-size: 1.1em;
  border-radius: 20px;
  cursor: pointer;
  min-width: 120px;
  min-height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  font-family: ${fontFamilies.base};
  text-transform: uppercase;

  &:hover {
    background: ${props =>
      darken(0.1, props.primary ? colors.primaryPink : colors.secondaryMidnightBlue)};
  }
`;

const Button = props => {
  const { children, className, primary, onClick } = props;
  return (
    <ThemedButton className={className} primary={primary} onClick={onClick}>
      {children}
    </ThemedButton>
  );
};

export default Button;
