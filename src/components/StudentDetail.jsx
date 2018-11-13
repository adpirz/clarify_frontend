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
    const student = find(students, {id: studentId});
    const studentsActions = filter(actions, (a) => {
      return a.student_id === studentId && !!a.completed_on;
    });

    let mainContentBodyNode = null;
    if (studentsActions.length) {
      mainContentBodyNode = (
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
            );
          })}
        </MainContentBody>
      );
    } else {
      mainContentBodyNode = (
        <StudentDetailEmptyState>
          <PosedP>
            <span role="img" aria-label="thinking">
              🤔
            </span>{" "}
            Looks like you haven't logged any actions for {student.first_name} yet.
          </PosedP>
          <PosedP>
            Go ahead and pick one from{" "}
            <span role="img" aria-label="pointing up at actions list">
              👆
            </span>{" "}
            when you've got an action you want to log.
          </PosedP>
        </StudentDetailEmptyState>
      );
    }

    return (
      <div>
        <PageHeading />
        {mainContentBodyNode}
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
