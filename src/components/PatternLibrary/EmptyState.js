import React from "react";
import styled from "styled-components";
import posed from "react-pose";

const Posed = posed.div({
  enter: { opacity: 1, delay: 200, staggerChildren: 70, beforeChildren: true },
  exit: { opacity: 0 }
});

const EmptyStateContainer = styled(Posed)`
  text-align: center;
  padding: 25px 100px;
`;

const EmptyState = ({ children }) => (
  <EmptyStateContainer>
    <h3>{children}</h3>
  </EmptyStateContainer>
);

export default EmptyState;
