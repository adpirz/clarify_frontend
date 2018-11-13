import React from "react";
import styled from "styled-components";
import posed from "react-pose";

const PosedContainer = posed.div({
  enter: {
    staggerChildren: 100,
  },
});

const PosedItem = posed.div({
  enter: {
    x: 0,
    opacity: 1,
  },
  exit: {
    x: -50,
    opacity: 0,
    transition: {
      duration: 100,
    },
  },
});

const StyledContainer = styled(PosedContainer)`
  display: flex;
  flex-direction: column;
`;

const Styled = styled(PosedItem)`
  padding: 10px;
  text-align: center;
  font-weight: 600;
`;
const NotFound = () => {
  return (
    <StyledContainer>
      <Styled style={{ fontSize: "3em" }}>
        <h1>404: Page Not Found</h1>
      </Styled>
      <Styled style={{ fontSize: "10em" }}>
        <span role="img" aria-label="confused face">
          😕
        </span>
      </Styled>
    </StyledContainer>
  );
};

export default NotFound;
