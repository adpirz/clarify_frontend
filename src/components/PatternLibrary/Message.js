import React from "react";
import styled from "styled-components";
import posed from "react-pose";
import { fontSizes, colors } from "./constants";

const MessagePosed = posed.div({
  enter: {
    x: 0,
    opacity: 1,
  },
  exit: {
    x: -20,
    opacity: 0,
  },
});

const MessageStyled = styled(MessagePosed)`
  color: ${colors.mainTheme};
  font-size: ${fontSizes.small};
  font-weight: bold;
  padding: 3px;
  margin: 5px auto;
  text-align: center;
  width: auto;
`;

const Message = ({ children }) => {
  if (!children || !children.length) {
    return null;
  }
  return <MessageStyled>{children}</MessageStyled>;
};

export default Message;
