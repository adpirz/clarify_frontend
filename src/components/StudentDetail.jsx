import React from "react";
import find from "lodash/find";
import filter from "lodash/filter";
import map from "lodash/map";
import get from "lodash/get";

import posed from "react-pose";
import styled from "styled-components";

import { DataConsumer } from "../DataProvider";
import {
  ActionCard,
  EmptyState,
  MainContentBody,
  PageHeading
} from "./PatternLibrary/";

const Posed = posed.div({
  enter: {
    x: 0,
    opacity: 1
  },
  exit: {
    x: -50,
    opacity: 0
  }
});

const LineStyled = styled(Posed)`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.4em;
  margin: 15px auto;
  text-align: center;
`;

const EmojiSpan = styled.span`
  margin: 0 8px;
  font-size: 1.8em;
`;

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
          <LineStyled>
            <EmojiSpan role="img" aria-label="thinking">
              🤔
            </EmojiSpan>{" "}
            <p>
              Looks like you haven't logged any actions for this student yet.
            </p>
          </LineStyled>
          <LineStyled>
            <p>
              Go ahead and pick one from when you've got an action you want to
              log.
            </p>
            <EmojiSpan role="img" aria-label="pointing up at actions list">
              👆
            </EmojiSpan>
          </LineStyled>
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
