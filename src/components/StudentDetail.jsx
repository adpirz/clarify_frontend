import React from "react";
import styled from "styled-components";
import posed from "react-pose";

import filter from "lodash/filter";
import map from "lodash/map";
import get from "lodash/get";
import find from "lodash/find";

import { DataConsumer } from "../DataProvider";
import { ActionCard, EmptyState, MainContentBody, PageHeading } from "./PatternLibrary/";
import { fontSizes } from "./PatternLibrary/constants";

const LinePosed = posed.div({
  enter: {
    x: 0,
    opacity: 1,
  },
  exit: {
    x: -50,
    opacity: 0,
  },
});

const LineStyled = styled(LinePosed)`
  justify-content: center;
  font-size: ${fontSizes.medium};
  align-items: center;
  margin: 15px auto;
  text-align: center;
`;

const EmojiSpan = styled.span`
  margin: 0 8px;
  font-size: 1.8em;
`;

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

    const studentID = parseInt(get(this.props, "match.params.studentID"), 10);
    const student = find(students, { id: studentID });
    const studentsActions = filter(actions, a => {
      return a.student_id === studentID && !!a.completed_on;
    });

    let mainContentBodyNode = null;
    if (studentsActions.length) {
      mainContentBodyNode = (
        <MainContentBody>
          {map(studentsActions, (a, i) => {
            const contextDeltas = filter(this.props.deltas, delta => {
              return a.delta_ids.indexOf(delta.delta_id) > -1;
            });

            const inEditMode = this.props.location.pathname.indexOf("edit") > -1;
            const thisActionSelected = parseInt(this.props.match.params.actionID, 10) === a.id;
            const editRoute = `/student/${studentID}/action/${a.id}/edit`;

            return (
              <ActionCard
                showTitle={false}
                action={a}
                key={i}
                student={student}
                doneEditingRoute={`/student/${studentID}/`}
                push={this.props.history.push}
                inEditMode={thisActionSelected && inEditMode}
                editRoute={editRoute}
                reminderButtonCopy="Remind Me"
                contextDeltas={contextDeltas}
                showContextSection={!!contextDeltas.length}
              />
            );
          })}
        </MainContentBody>
      );
    } else {
      mainContentBodyNode = (
        <StudentDetailEmptyState>
          <LineStyled>
            <p>
              <EmojiSpan role="img" aria-label="thinking">
                {/* eslint-disable-next-line */}
                🤔
              </EmojiSpan>
              <EmojiSpan role="img" aria-label="thinking">
                {/* eslint-disable-next-line */}
                🤔
              </EmojiSpan>
              <EmojiSpan role="img" aria-label="thinking">
                {/* eslint-disable-next-line */}
                🤔
              </EmojiSpan>
            </p>
            <p>Looks like you haven't logged any actions for this student yet.</p>
          </LineStyled>
          <LineStyled>
            <p>
              Go ahead and pick one{" "}
              <EmojiSpan role="img" aria-label="pointing up at actions list">
                {/* eslint-disable-next-line */}
                👆
              </EmojiSpan>{" "}
              when you've got an action you want to log.
            </p>
          </LineStyled>
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
    {({ students, actions, deltas }) => (
      <StudentDetail students={students} {...props} actions={actions} deltas={deltas} />
    )}
  </DataConsumer>
);
