import React from 'react';
import styled from 'styled-components';

const EmptyStateContainer = styled.section`
  text-align: center;
  padding: 25px 100px;
`;


const EmptyState = ({children}) => (
  <EmptyStateContainer>
    <h3>
      {children}
    </h3>
  </EmptyStateContainer>
);


export default EmptyState;