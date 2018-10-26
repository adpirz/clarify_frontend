import React from 'react';
import styled from 'styled-components';
import map from 'lodash/map';

import { DataConsumer } from '../DataProvider';
import { colors } from './PatternLibrary/constants';

const DeltaStyled = styled.div`
  width: 220px;
  min-height: 160px;
  margin: 10px;
  box-shadow: 0 7px 11px rgba(0, 0, 0, 0.17), 0 3px 6px rgba(0, 0, 0, 0.23);
  border-radius: 20px;
  display: flex;
  align-content: center;
  flex-wrap: wrap;
  padding: 15px;
`;

const CardHeader = styled.div`
  height: 40px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.2em;
  font-size: 1.2em;
  color: ${colors.DELTA_CARD_HEADER_TEXT_COLOR};
`;


const Home = ({students}) => {
  if (!students) {
    return null;
  }
  return (
    <div>
      {map(students.slice(0,10), (s) => {
        return (
          <h4>{s.last_name} {s.first_name}</h4>
        )
      })}
    </div>
  )
}



export default props => (
  <DataConsumer>
    {({students, actions}) => (
      <Home
        students={students}
        actions={actions}
        {...props}
      />
    )}
  </DataConsumer>
);
