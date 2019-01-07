import React from "react";
import styled from "styled-components";

import { colors, fontSizes } from "./constants";

const IntegrationButton = styled.button`
  border-radius: 0;
  background-color: ${colors.googleBlue};
  width: 150px;
  height: 50px;
  font-size: ${fontSizes.medium};
  color: ${colors.white};
  display: inline-flex;
  border: 1px solid ${colors.googleBlue}
  padding: 0;
  margin: 0 15px;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.25);

  &:hover {
    box-shadow: 0 0 3px 3px rgba(66,133,244,.3);
  }
`;

const LogoContainer = styled.div`
  height: 48px;
  background-color: ${colors.white};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
`;

const ButtonLabel = styled.span`
  flex-grow: 3;
`;

const ThirdPartyLoginButton = ({ copy, icon, onClick }) => {
  return (
    <IntegrationButton onClick={onClick}>
      <LogoContainer>{icon}</LogoContainer>
      <ButtonLabel>{copy}</ButtonLabel>
    </IntegrationButton>
  );
};

export default ThirdPartyLoginButton;
