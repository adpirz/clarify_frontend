import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import { fontSizes, fontFamilies, colors } from "./constants";

const LogoDiv = styled.div`
  display: inline-block;
  width: 150px;
`;

const LogoLink = styled(Link)`
  text-decoration: none;
  font-weight: 500;
  font-family: ${fontFamilies.base};
  font-size: ${fontSizes.huge};
  color: ${colors.accent};
`;

const Logo = () => {
  return (
    <LogoDiv>
      <LogoLink to="/">Clarify</LogoLink>
    </LogoDiv>
  );
};

export default Logo;
