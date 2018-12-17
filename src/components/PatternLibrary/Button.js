import React from "react";
import styled from "styled-components";
import darken from "polished/lib/color/darken";
import lighten from "polished/lib/color/lighten";
import { colors, fontFamilies } from "./constants";

const bgColor = (props, hover = false) => {
  const baseColor = props.primary ? colors.primaryPink : colors.secondaryMidnightBlue;
  if (props.disabled) return lighten(0.5, baseColor);
  if (hover) return darken(0.1, baseColor);
  return baseColor;
};

const ThemedButton = styled.button`
  background-color: ${props => bgColor(props)};
  color: ${colors.white};
  padding: 10px;
  font-size: 1.1em;
  border-radius: 5px;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  min-width: 120px;
  min-height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  font-family: ${fontFamilies.base};
  text-transform: uppercase;

  &:hover {
    background: ${props => bgColor(props, true)};
  }
`;

const Button = props => {
  const { children, className, primary, onClick, ...rest } = props;
  return (
    <ThemedButton className={className} primary={primary} onClick={onClick} {...rest}>
      {children}
    </ThemedButton>
  );
};

export default Button;
