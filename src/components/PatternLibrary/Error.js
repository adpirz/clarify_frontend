import React from "react";
import styled from "styled-components";
import { fontSizes, colors } from "./constants";

const ErrorDiv = styled.div`
  color: ${colors.errorOrange};
  font-size: ${fontSizes.small};
  font-weight: bold;
  padding: 15px 15px;
  text-align: center;
  width: auto;
`;

const Error = ({ children }) => {
  if (!children) {
    return null;
  }
  return <ErrorDiv>{children}</ErrorDiv>;
};

export default Error;
