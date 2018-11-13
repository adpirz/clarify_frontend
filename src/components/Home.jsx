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
  padding: 0 1.2em;
`;

const StudentRowHeading = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 15px 0px;
`;

const StudentName = styled(NavLink)`
  display: inline-flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-size: ${fontSizes.huge};
  color: ${colors.black};
  font-weight: bold;
  text-decoration: none;
`;

const StudentActionIconList = styled(ActionIconList)`
  width: 35%;
`;

const StudentActionsEmptyState = styled(EmptyState)`
  width: 25%;
  margin: auto 0;
`;

class Home extends React.Component {
  state = {
    selectedStudent: null,
    type: "",
  };

  handleActionFormClick = (newStudentId = null) => {
    this.setState(prevState => {
      return {
        selectedStudentId: newStudentId === prevState.selectedStudentId ? null : newStudentId,
      };
    });
  };

  handleTypeSelection = (newStudentId = null, newType = null) => {
    const { type: oldType, selectedStudentId: oldSelectedStudentId } = this.state;
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
            oldSelectedStudentId !== newStudentId ? newStudentId : oldSelectedStudentId,
        };
      });
    }
  };

  getStudentDeltaList = studentViewModel => {
    const { saveAction } = this.props;
    const { actionsAndDeltas, student } = studentViewModel;

    if (!actionsAndDeltas.length && this.state.selectedStudentId === student.id) {
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
    } else if (!actionsAndDeltas.length) {
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

    return (
      <div>
        {map(actionsAndDeltas.slice(0, 3), (node, i) => {
          if (node.note) {
            return <ActionCard showTitle={false} student={student} action={node} key={i} />;
          } else {
            return (
              <div key={i}>
                <div>DELTA: {node.type}</div>
                <div>
                  node:{" "}
                  {node.score
                    ? node.score.assignment_name
                    : node.missing_assignments[0].assignment_name}
                </div>
              </div>
            );
          }
        })}
      </div>
    );
  };

  getStudentViewModels = student => {
    const { actions, deltas, students } = this.props;

    if (!students || !students.length) {
      return null;
    }

    const studentViewModels = reduce(
      students,
      (accumulator, student) => {
        const actionsForStudent = filter(actions, a => {
          return a.student_id === student.id;
        });
        const deltasForStudent = filter(deltas, d => {
          return d.student_id === student.id;
        });

        const combinedAndSorted = orderBy(
          actionsForStudent.concat(deltasForStudent),
          ["created_on"],
          ["desc"]
        );

        accumulator.push({
          student,
          actionsAndDeltas: combinedAndSorted,
          mostRecentAction: actionsForStudent.length ? actionsForStudent[0].created_on : null,
        });
        return accumulator;
      },
      []
    );

    return orderBy(studentViewModels, ["mostRecentAction"], ["desc"]);
  };

  render() {
    const studentViewModels = this.getStudentViewModels();

    if (!studentViewModels || !studentViewModels.length) {
      return null;
    }

    return (
      <div>
        <PageHeading />
        <MainContentBody>
          {map(studentViewModels.slice(0, 3), (studentViewModel, i) => {
            const { student } = studentViewModel;
            const isSelected = this.state.selectedStudentId === student.id;
            return (
              <StudentRow key={i}>
                <StudentRowHeading>
                  <StudentName to={`/student/${student.id}`}>
                    {student.first_name} {student.last_name[0]}
                  </StudentName>
                  <StudentActionIconList
                    isSelected={isSelected}
                    type={this.state.type}
                    handleTypeSelection={this.handleTypeSelection.bind(this, student.id)}
                  />
                </StudentRowHeading>
                {this.getStudentDeltaList(studentViewModel)}
              </StudentRow>
            );
          })}
        </MainContentBody>
      </div>
    );
  }
}

export default props => (
  <DataConsumer>
    {({ students, actions, saveAction, deltas }) => (
      <Home
        students={students}
        actions={actions}
        saveAction={saveAction}
        deltas={deltas}
        {...props}
      />
    )}
  </DataConsumer>
);
