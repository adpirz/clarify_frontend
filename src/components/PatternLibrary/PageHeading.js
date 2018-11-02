import React from 'react';
import find from 'lodash/find';
import styled from 'styled-components';

import { DataConsumer } from '../../DataProvider';
import { colors } from './constants';


const PageHeadingContainer = styled.h2`
  width: 100%;
  height: 10vh;
  background-color: ${colors.mainTheme};
  margin: 0;
  padding: 10px;
  display: flex;
  align-items: center;
  color: ${colors.white};
`;

const PageHeading = ({ location, match, students }) => {
  const studentIdRegex = /\/student\/([0-9]*)/;
  let pageHeadingCopy = "Loading";
  if (students) {
    pageHeadingCopy = 'Next Steps';

    const studentIdRegexResults = location.pathname.match(studentIdRegex);
    if (studentIdRegexResults) {
      const currentStudent = find(students, {id: parseInt(studentIdRegexResults[1], 10)})
      pageHeadingCopy = `${currentStudent.first_name}'s Timeline`;
    } else if (location.pathname.indexOf('/reminders') > -1) {
      pageHeadingCopy = `Reminders`;
    }
  }

  return (
    <PageHeadingContainer>
      {pageHeadingCopy}
    </PageHeadingContainer>
  )
}



export default (props) => (
  <DataConsumer>
    {({students}) => (
      <PageHeading students={students} {...props}/>
    )}
  </DataConsumer>
);