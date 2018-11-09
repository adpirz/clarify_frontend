import React from 'react';
import styled from 'styled-components';
import filter from 'lodash/filter';
import map from 'lodash/map';
import get from 'lodash/get';
import find from 'lodash/find';

import posed from "react-pose";

import { DataConsumer } from "../DataProvider";
import {
  ActionCard,
  EmptyState,
  MainContentBody,
  PageHeading
} from "./PatternLibrary/";

const PosedP = posed.p({
  enter: {
    x: 0,
    opacity: 1
  },
  exit: {
    x: -50,
    opacity: 0
  }
});

const StudentDetailEmptyState = styled(EmptyState)`
  box-shadow: none;
  margin: auto auto;
`;

class StudentDetail extends React.Component {
  render() {
    const { students, actions } = this.props;
    if (!students || !students.length) {
      return null;
    }

    const studentId = parseInt(get(this.props, 'match.params.studentId'), 10);
    const studentsActions = filter(actions, (a) => {
      return a.student_id === studentId && !!a.completed_on;
    });

      if (studentsActions.length) {
        const student = find(students, {id: studentId});
        return (
          <MainContentBody>
            {map(studentsActions, (a, i) => {
              return (
                <ActionCard
                  closeActionForm={this.handleActionFormClick}
                  reminderButtonCopy="Remind Me"
                  showTitle={false}
                  action={a}
                  key={i}
                  student={student} />
              )
            })}
          </MainContentBody>
        );
      }

    if (studentsActions.length) {
      return (
        <div>
          <PageHeading />
          <MainContentBody>
            {map(studentsActions, (a, i) => {
              return <ActionCard action={a} key={i} />;
            })}
          </MainContentBody>
        </div>
      );
    }

    return (
      <div>
        <PageHeading />
        <StudentDetailEmptyState>
          <PosedP>
            <span role="img" aria-label="thinking">
              🤔
            </span>{" "}
            Looks like you haven't logged any actions for this student yet.
          </PosedP>
          <PosedP>
            Go ahead and pick one from{" "}
            <span role="img" aria-label="pointing up at actions list">
              👆
            </span>{" "}
            when you've got an action you want to log.
          </PosedP>
        </StudentDetailEmptyState>
      </div>
    );
  }
}

export default props => (
  <DataConsumer>
    {({ students, actions }) => (
      <StudentDetail students={students} {...props} actions={actions} />
    )}
  </DataConsumer>
);
