import React from 'react';
import styled from 'styled-components';

const LoadingDiv = styled.div`
  background: url('./loading.gif');
  background-repeat: no-repeat;
  background-size: contain;
  display: inline-block;
  width: 200px;
  height: 200px;
`;

const Loading = () => {
  return (
    <div style={{width: '100%', textAlign: 'center'}}>
      <LoadingDiv />
    </div>
  );
}

export default Loading;