import React from "react";
import styled from "styled-components";
import posed from "react-pose";
import { effects } from "./constants";

const Posed = posed.div({
  enter: { opacity: 1, delay: 200, staggerChildren: 50, beforeChildren: true },
  exit: { opacity: 0 },
});

const EmptyStateContainer = styled(Posed)`
  text-align: center;
  padding: 25px 100px;
  box-shadow: ${effects.cardBoxShadow};
`;

const EmptyState = ({ children, className }) => (
  <EmptyStateContainer className={className}>
    <h3>{children}</h3>
  </EmptyStateContainer>
);

export default EmptyState;
