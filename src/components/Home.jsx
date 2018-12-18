import React from "react";
import styled from "styled-components";
import map from "lodash/map";
import filter from "lodash/filter";
import orderBy from "lodash/orderBy";
import reduce from "lodash/reduce";
import without from "lodash/without";
import { NavLink } from "react-router-dom";

import { DataConsumer } from "../DataProvider";
import { colors, fontSizes } from "./PatternLibrary/constants";
import {
  MainContentBody,
  ActionIconList,
  ActionCard,
  DeltaCard,
  EmptyState,
  PageHeading,
} from "./PatternLibrary";

const StudentRow = styled.div`
  margin: 0 1.8em;
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
  font-size: ${fontSizes.xlarge};
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

const ActionAndDeltaCard = styled.div`
  display: flex;
  overflow: visible;
`;

class Home extends React.Component {
  state = {
    selectedStudent: null,
    type: "",
    deltaIDsForAction: [],
  };

  closeActionForm = () => {
    this.setState({ selectedStudentId: null });
  };

  handleDeltaClick = deltaID => {
    this.setState(({ deltaIDsForAction }) => {
      if (deltaIDsForAction.indexOf(deltaID) > -1) {
        const newDeltaIDsForAction = without(deltaIDsForAction, deltaID);
        return {
          deltaIDsForAction: newDeltaIDsForAction,
        };
      } else {
        deltaIDsForAction.push(deltaID);
        return {
          deltaIDsForAction,
        };
      }
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
        deltaIDsForAction: [],
      });
    } else {
      // it not, update whatever's new
      this.setState(({ deltaIDsForAction }) => {
        return {
          type: oldType !== newType ? newType : oldType,
          selectedStudentId:
            oldSelectedStudentId !== newStudentId ? newStudentId : oldSelectedStudentId,
          deltaIDsForAction: oldSelectedStudentId !== newStudentId ? [] : deltaIDsForAction,
        };
      });
    }
  };

  getStudentDeltaList = studentViewModel => {
    const { actionsAndDeltas, student } = studentViewModel;

    if (!actionsAndDeltas.length) {
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
      <ActionAndDeltaCard>
        {map(actionsAndDeltas.slice(0, 3), (node, i) => {
          if (node.note) {
            return <ActionCard showTitle={false} student={student} action={node} key={i} />;
          } else {
            const isSelectable = this.state.selectedStudentId === student.id;
            return (
              <DeltaCard
                delta={node}
                key={i}
                isSelected={this.state.deltaIDsForAction.indexOf(node.delta_id) > -1}
                isSelectable={isSelectable}
                handleDeltaClick={isSelectable ? this.handleDeltaClick : null}
              />
            );
          }
        })}
      </ActionAndDeltaCard>
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
            let actionFormNode = null;
            const { student, actionsAndDeltas } = studentViewModel;

            if (this.state.selectedStudentId === student.id) {
              const { deltas } = this.props;
              const contextDeltas = filter(actionsAndDeltas, d => {
                return d.delta_id && this.state.deltaIDsForAction.indexOf(d.delta_id) > -1;
              });
              actionFormNode = (
                <ActionCard
                  closeActionForm={this.closeActionForm}
                  showContextSection={!!deltas.length}
                  showTitle={false}
                  student={student}
                  reminderButtonCopy="Remind Me"
                  type={this.state.type}
                  contextDeltas={contextDeltas}
                  inEditMode={true}
                />
              );
            }
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
                {actionFormNode}
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
    {({ students, actions, deltas }) => (
      <Home students={students} actions={actions} deltas={deltas} {...props} />
    )}
  </DataConsumer>
);
