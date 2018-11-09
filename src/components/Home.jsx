import React from "react";
import styled from "styled-components";
import map from "lodash/map";
import filter from "lodash/filter";
import orderBy from "lodash/orderBy";
import reduce from "lodash/reduce";
import { NavLink } from "react-router-dom";

import { DataConsumer } from "../DataProvider";
import { colors, fontSizes } from "./PatternLibrary/constants";
import {
  MainContentBody,
  ActionCard,
  ActionForm,
  PageHeading
} from "./PatternLibrary";

const CardHeader = styled(NavLink)`
  height: 40px;
  display: inline-flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.2em;
  font-size: ${fontSizes.large};
  color: ${colors.textGrey};
  text-decoration: none;
`;

const ActionList = styled.div`
  display: flex;
  flex-direction: row;
`;

const StyledActionCard = styled(ActionCard)`
  max-width: 33%;
  flex-direction: row;
  cursor: pointer;
`;

class Home extends React.Component {
  state = {
    selectedStudent: null
  };

  handleActionFormClick = (studentId = null) => {
    this.setState(prevState => {
      return {
        selectedStudentId:
          studentId === prevState.selectedStudentId ? null : studentId
      };
    });
  };

  getStudentDeltaList = student => {
    const { actions, createAction } = this.props;
    const actionsForStudent = filter(actions, a => {
      return a.student_id === student.id;
    });
    if (!actionsForStudent.length) {
      if (this.state.selectedStudentId === student.id) {
        return (
          <ActionForm
            closeActionForm={this.handleActionFormClick}
            student={student}
            createAction={createAction}
          />
        );
      } else {
        return (
          <StyledActionCard
            action={null}
            firstName={student.first_name}
            handleActionFormClick={this.handleActionFormClick.bind(
              this,
              student.id
            )}
          />
        );
      }
    }

    return (
      <ActionList>
        {map(actionsForStudent.slice(3), (a, i) => {
          return <StyledActionCard key={i} action={a} student={student} />;
        })}
      </ActionList>
    );
  };

  getStudentViewModels = () => {
    const { students, actions } = this.props;
    if (!students || !students.length) {
      return null;
    }

    const filteredStudents = reduce(
      students,
      (accumulator, student) => {
        const studentsActions = filter(actions, { student_id: student.id });
        const sortedActions = orderBy(studentsActions, ["id"], ["desc"]);

        accumulator.push({
          student,
          actions_list: sortedActions,
          most_recent_action: sortedActions.length
            ? sortedActions[0].created_on
            : null
        });
        return accumulator;
      },
      []
    );

    return orderBy(filteredStudents, ["most_recent_action"], ["desc"]);
  };

  render() {
    const studentViewModels = this.getStudentViewModels();

    if (!studentViewModels) {
      return null;
    }

    return (
      <div>
        <PageHeading />
        <MainContentBody>
          {map(studentViewModels.slice(0, 3), ({ student }, i) => {
            return (
              <div key={i}>
                <CardHeader to={`/student/${student.id}`}>
                  {student.first_name} {student.last_name[0]}
                </CardHeader>
                {this.getStudentDeltaList(student)}
              </div>
            );
          })}
        </MainContentBody>
      </div>
    );
  }
}

export default props => (
  <DataConsumer>
    {({ students, actions, createAction }) => (
      <Home
        students={students}
        actions={actions}
        createAction={createAction}
        {...props}
      />
    )}
  </DataConsumer>
);
