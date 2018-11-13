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
  ActionIconList,
  ActionCard,
  EmptyState,
  PageHeading,
} from "./PatternLibrary";

const StudentRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 15px 0px;
`;

const StudentHeader = styled(NavLink)`
  display: inline-flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.2em;
  font-size: ${fontSizes.huge};
  color: ${colors.black};
  font-weight: bold;
  text-decoration: none;
`;

const ActionList = styled.div`
  display: flex;
  flex-direction: row;
`;

const StudentActionIconList = styled(ActionIconList)`
  width: 35%;
`;

const StyledActionCard = styled(ActionCard)`
  max-width: 33%;
  flex-direction: row;
  cursor: pointer;
`;

const StudentActionsEmptyState = styled(EmptyState)`
  width: 25%;
  margin: auto auto;
`;

class Home extends React.Component {
  state = {
    selectedStudent: null,
    type: "",
  };

  handleActionFormClick = (newStudentId = null) => {
    this.setState(prevState => {
      return {
        selectedStudentId:
          newStudentId === prevState.selectedStudentId ? null : newStudentId,
      };
    });
  };

  handleTypeSelection = (newStudentId = null, newType = null) => {
    const {
      type: oldType,
      selectedStudentId: oldSelectedStudentId,
    } = this.state;
    // If both type and student are same, then the user clicked the same action
    // icon they used to open the form, so we should close it.
    if (oldType === newType && oldSelectedStudentId === newStudentId) {
      this.setState({
        type: "",
        selectedStudentId: null,
      });
    } else {
      // it not, update whatever's new
      this.setState(prevState => {
        return {
          type: oldType !== newType ? newType : oldType,
          selectedStudentId:
            oldSelectedStudentId !== newStudentId
              ? newStudentId
              : oldSelectedStudentId,
        };
      });
    }
  };

  getStudentDeltaList = student => {
    const { actions, saveAction } = this.props;
    const actionsForStudent = filter(actions, a => {
      return a.student_id === student.id;
    });
    if (!actionsForStudent.length) {
      if (this.state.selectedStudentId === student.id) {
        return (
          <ActionCard
            closeActionForm={this.handleActionFormClick}
            showTitle={false}
            student={student}
            saveAction={saveAction}
            reminderButtonCopy="Remind Me"
            action={{ type: this.state.type }}
          />
        );
      } else {
        return (
          <StudentActionsEmptyState>
            Click an icon up there{" "}
            <span role="img" aria-label="pointing up at actions list">
              👆
            </span>{" "}
            to create your first action for {student.first_name}
          </StudentActionsEmptyState>
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
            : null,
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
            const isSelected = this.state.selectedStudentId === student.id;
            return (
              <div key={i}>
                <StudentRow>
                  <StudentHeader to={`/student/${student.id}`}>
                    {student.first_name} {student.last_name[0]}
                  </StudentHeader>
                  <StudentActionIconList
                    isSelected={isSelected}
                    type={this.state.type}
                    handleTypeSelection={this.handleTypeSelection.bind(
                      this,
                      student.id
                    )}
                  />
                </StudentRow>
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
    {({ students, actions, saveAction }) => (
      <Home
        students={students}
        actions={actions}
        saveAction={saveAction}
        {...props}
      />
    )}
  </DataConsumer>
);
