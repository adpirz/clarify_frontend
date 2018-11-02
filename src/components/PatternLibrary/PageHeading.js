import React from 'react';
import find from 'lodash/find';
import styled from 'styled-components';

import { DataConsumer } from '../../DataProvider';
import { colors } from './constants';
import { ActionIconList, ActionForm } from '.';


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

const PageHeadingCopy = styled.h2`
  margin: 10px 0px;
`;


class PageHeading extends React.Component {
  state = {
    type: null,
    showActionForm: false,
  }

  renderActionForm = (student) => {
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
        createAction={createAction} />
    )
  }

  handleTypeSelection = (type) => {
    this.setState((prevState) => {
      return {
        type: prevState.type === type ? null : type,
      }
    })
  }

  render() {
    const { location, students } = this.props;
    const studentIdRegex = /\/student\/([0-9]*)/;
    let pageHeadingCopy = "Loading";
    let currentStudent = null;
    let actionIconListNode = null;
    if (students) {
      pageHeadingCopy = 'Next Steps';

      const studentIdRegexResults = location.pathname.match(studentIdRegex);
      if (studentIdRegexResults) {
        currentStudent = find(students, {id: parseInt(studentIdRegexResults[1], 10)})
        pageHeadingCopy = `${currentStudent.first_name}'s Timeline`;
        const { type } = this.state;
        actionIconListNode = (
          <div style={{width: '25%'}}>
            <ActionIconList type={type} handleTypeSelection={this.handleTypeSelection} />
          </div>
        )
      } else if (location.pathname.indexOf('/reminders') > -1) {
        pageHeadingCopy = `Reminders`;
      }
    }

    return (
      <PageHeadingContainer>
        <PageHeadingCopy>
          {pageHeadingCopy}
        </PageHeadingCopy>
        {actionIconListNode}
        {this.renderActionForm(currentStudent)}
      </PageHeadingContainer>
    )
  }
}



export default (props) => (
  <DataConsumer>
    {({ students, createAction }) => (
      <PageHeading students={students} createAction={createAction} {...props}/>
    )}
  </DataConsumer>
);