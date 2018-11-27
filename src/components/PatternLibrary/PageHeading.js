import React from "react";
import find from "lodash/find";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import posed, { PoseGroup } from "react-pose";

import { DataConsumer } from "../../DataProvider";
import { colors, fontSizes } from "./constants";
import { ActionIconList, ActionCard } from ".";

const PageHeadingContainer = styled.div`
  background-color: ${colors.mainTheme};
  margin: 0;
  padding: 10px 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  color: ${colors.white};
  min-height: 50px;
`;

const PageHeadingPosed = posed.h2({
  before: {
    scale: 1.2,
    opacity: 0,
  },
  enter: {
    scale: 1,
    opacity: 1,
    delay: 200,
  },
  exit: {
    scale: 0.9,
    opacity: 0,
    transition: {
      duration: 150,
    },
  },
});

const PageHeadingCopy = styled(PageHeadingPosed)`
  min-width: 200px;
  text-align: center;
  margin: 0;
  font-size: ${fontSizes.large};
`;

class PageHeading extends React.Component {
  state = {
    type: null,
    showActionForm: false,
  };

  renderActionForm = student => {
    const { saveAction } = this.props;
    const { type } = this.state;
    if (!type) {
      return null;
    }
    return (
      <ActionCard
        closeActionForm={this.handleTypeSelection.bind(this, null)}
        type={type}
        student={student}
        reminderButtonCopy="Remind Me"
        showTitle={false}
        saveAction={saveAction}
      />
    );
  };

  handleTypeSelection = type => {
    this.setState(prevState => {
      return {
        type: prevState.type === type ? null : type,
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
          id: parseInt(studentIdRegexResults[1], 10),
        });
        pageHeadingCopy = `${currentStudent.first_name}'s Timeline`;
        const { type } = this.state;
        actionIconListNode = (
          <div style={{ width: "25%" }}>
            <ActionIconList
              isSelected={!!type}
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
        <PoseGroup animateOnMount preEnterPose="before">
          <PageHeadingCopy key={this.props.location.key || "start"}>
            {pageHeadingCopy}
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
    {({ students, saveAction }) => (
      <PageHeading students={students} saveAction={saveAction} {...props} />
    )}
  </DataConsumer>
));
