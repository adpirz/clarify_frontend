import React from "react";
import styled from "styled-components";
import { fontSizes, colors } from "./constants";

const MessageDiv = styled.div`
  color: ${colors.mainTheme};
  font-size: ${fontSizes.small};
  font-weight: bold;
  padding: 15px 15px;
  margin: 15px auto;
  text-align: center;
  width: auto;
`;

const Message = ({ children }) => {
  if (!children || !children.length) {
    return null;
  }
  return <MessageDiv>{children}</MessageDiv>;
};

export default Message;
