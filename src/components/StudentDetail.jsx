import React from 'react';
import find from 'lodash/find';
import filter from 'lodash/filter';
import map from 'lodash/map';
import get from 'lodash/get';
import styled from 'styled-components';
import { DataConsumer } from '../DataProvider';
import {
  ActionCard,
  EmptyState,
} from './PatternLibrary/';


const ActionList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

class StudentDetail extends React.Component {
  render() {
    const { students, actions } = this.props;
    if (!students || !students.length) {
      return null;
    }

    const studentId = parseInt(get(this.props, 'match.params.studentId'), 10);
    const { id } = find(students, {id: studentId});
    const studentsActions = filter(actions, {student_id: id});

      if (studentsActions.length) {
          return (
            <ActionList>
              {map(studentsActions, (a, i) => {
                return <ActionCard action={a} key={i} />;
              })}
            </ActionList>
          );
      }

      return (
        <EmptyState>
          <p>
            <span role="img" aria-label="thinking">🤔</span> Looks like you haven't logged any actions for this student yet.
          </p>
          <p>
            Go ahead and pick one from <span role="img" aria-label="pointing up at actions list">👆</span> when
            you've got an action you want to log.
          </p>
        </EmptyState>
      )
  }
}

export default props => (
  <DataConsumer>
    {({students, actions}) => (
      <StudentDetail
        students={students} {...props}
        actions={actions} />
    )}
  </DataConsumer>
);