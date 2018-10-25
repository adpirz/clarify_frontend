import React from 'react';
import styled from 'styled-components';
import {
  fontSizes,
  fontFamilies,
  colors,
} from '../../PatternLibrary/constants';

const LogoDiv = styled.div`
  display: inline-block;
  width: 150px;
  font-family: ${fontFamilies.base};
  font-size: ${fontSizes.huge};
  color: ${colors.accent}
`;

const Logo = () => {
  return (
    <LogoDiv>Clarify</LogoDiv>
  )
};

export default Logo;