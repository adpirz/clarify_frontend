import React from "react";
import find from "lodash/find";
import filter from "lodash/filter";
import map from "lodash/map";
import get from "lodash/get";

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

class StudentDetail extends React.Component {
  render() {
    const { students, actions } = this.props;
    if (!students || !students.length) {
      return null;
    }

    const studentId = parseInt(get(this.props, "match.params.studentId"), 10);
    const { id } = find(students, { id: studentId });
    const studentsActions = filter(actions, { student_id: id });

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
        <EmptyState>
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
        </EmptyState>
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
