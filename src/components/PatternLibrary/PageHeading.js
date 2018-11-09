import React from "react";
import find from "lodash/find";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import posed, { PoseGroup } from "react-pose";

import { DataConsumer } from "../../DataProvider";
import { colors } from "./constants";
import { ActionIconList, ActionForm } from ".";

const PageHeadingContainer = styled.div`
  background-color: ${colors.mainTheme};
  margin: 0;
  padding: 10px 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  color: ${colors.white};
`;

const transition = {
  default: {
    duration: 350
  }
};
const Posed = posed.div({
  before: {
    x: -20,
    scale: 3.0,
    opacity: 0.3,
    transition: {
      scale: {
        duration: 400
      }
    }
  },
  enter: {
    x: 0,
    scale: 1,
    opacity: 1,
    transition
  },
  exit: {
    x: 140,
    scale: 0.8,
    opacity: 0,
    transition
  }
});

const PageHeadingCopy = styled(Posed)`
  min-width: 200px;
  text-align: center;
`;

class PageHeading extends React.Component {
  state = {
    type: null,
    showActionForm: false
  };

  renderActionForm = student => {
    const { createAction } = this.props;
    const { type } = this.state;
    if (!type) {
      return null;
    }
    return (
      <ActionForm
        closeActionForm={this.handleTypeSelection.bind(this, null)}
        parentManagedType={type}
        student={student}
        createAction={createAction}
      />
    );
  };

  handleTypeSelection = type => {
    this.setState(prevState => {
      return {
        type: prevState.type === type ? null : type
      };
    });
  };

  render() {
    const { location, students } = this.props;
    const studentIdRegex = /\/student\/([0-9]*)/;
    let pageHeadingCopy = "Loading";
    let currentStudent = null;
    let actionIconListNode = null;
    if (students) {
      pageHeadingCopy = "Next Steps";

      const studentIdRegexResults = location.pathname.match(studentIdRegex);
      if (studentIdRegexResults) {
        currentStudent = find(students, {
          id: parseInt(studentIdRegexResults[1], 10)
        });
        pageHeadingCopy = `${currentStudent.first_name}'s Timeline`;
        const { type } = this.state;
        actionIconListNode = (
          <div style={{ width: "25%" }}>
            <ActionIconList
              type={type}
              handleTypeSelection={this.handleTypeSelection}
            />
          </div>
        );
      } else if (location.pathname.indexOf("/reminders") > -1) {
        pageHeadingCopy = `Reminders`;
      }
    }

    return (
      <PageHeadingContainer>
        <PoseGroup preEnterPose="before">
          <PageHeadingCopy key={this.props.location.key || "start"}>
            <h2>{pageHeadingCopy}</h2>
          </PageHeadingCopy>
        </PoseGroup>
        {actionIconListNode}
        {this.renderActionForm(currentStudent)}
      </PageHeadingContainer>
    );
  }
}

export default withRouter(props => (
  <DataConsumer>
    {({ students, createAction }) => (
      <PageHeading students={students} createAction={createAction} {...props} />
    )}
  </DataConsumer>
));
