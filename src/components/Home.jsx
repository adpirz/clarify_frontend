import React from 'react';
import styled from 'styled-components';
import map from 'lodash/map';
import filter from 'lodash/filter';

import { DataConsumer } from '../DataProvider';
import { colors } from './PatternLibrary/constants';
import { CardContainer } from './PatternLibrary';

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


class Home extends React.Component {
  getStudentActionList = (student) => {
    const { actions } = this.props;
    const actionsForStudent = filter(actions, (a) => {
      return a.student.id === student.id;
    })

    if (actionsForStudent.length === 0) {
      return (
        <div>
          Create your first action!
        </div>
      )
    }
    return (
      <div>
        {map(actionsForStudent, (a) => {
          return (
            <CardContainer>
              {a.note}
            </CardContainer>
          )
        })}
      </div>
    )
  }


  render() {
    const { students, actions } = this.props;

    if (!students || !actions) {
      return null;
    }

    return (
      <div>
        {map(students.slice(0,10), (s) => {
          return (
            <div>
              <CardHeader>{s.last_name} {s.first_name}</CardHeader>
              {this.getStudentActionList(s)}
            </div>
          )
        })}
      </div>
    )
  }
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
