import _ from 'lodash';

import React from 'react';
import styled from 'styled-components';
import { lighten, darken } from 'polished';
import colors from '../colors.js';

const ReportSummaryContainer = styled.div`
  display: inline-block;
  border-radius: 10px;
  box-shadow: 0px -1px 10px 2px rgba(166,166,166,1);
  padding: 10px;
  margin: 20px;
  min-height: 125px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;

  &:hover {
    background: ${() => darken(.1, colors.white) };
  }
`;

const SummaryRow = styled.div`
  padding: 8px 5px;
`

const Footer = styled.div`
  padding: 25px;
  font-size: 0.8em;
  font-style: italic;
  // margin-top: 20px;
  color: ${lighten(.6, 'black')};
  border-top: 1px solid ${lighten(.8, 'black')};
  text-align:right;
`

class ReportSummary extends React.PureComponent {
  constructor(props) {
    super(props);

    this.selectReport = this.selectReport.bind(this);
  }
    selectReport() {
      this.props.selectReport(this.props.report);
    }

    getSummaryData = () => {
      const { data, title, subheading } = _.get(this.props, 'report');
      const COLUMN_CODE_FOR_SUMMARY = 4 // The most magic.
      let maxAttendancePercentage = 0;
      let minAttendancePercentage = 100;
      let sumAttendance = 0;
      let maxAttendanceStudentId;
      let minAttendanceStudentId;
      _.forEach(data, (studentRow) => {
        const percentage = _.find(studentRow.attendance_data, {column_code: COLUMN_CODE_FOR_SUMMARY}).percentage;
        sumAttendance += percentage;
        if (maxAttendancePercentage < percentage) {
          maxAttendancePercentage =  percentage;
          maxAttendanceStudentId = studentRow.student_id;
        }
        if (minAttendancePercentage > percentage) {
          minAttendancePercentage =  percentage;
          minAttendanceStudentId = studentRow.student_id;
        }
      });

      const maxAttendanceStudent = _.find(this.props.students, {id: maxAttendanceStudentId});
      const minAttendanceStudent = _.find(this.props.students, {id: minAttendanceStudentId});

      return {
        title,
        subheading,
        count: _.size(data),
        mean: `${_.round(sumAttendance / _.size(data) * 100, 2)}%`,
        highestStudent: `${maxAttendanceStudent.first_name} ${maxAttendanceStudent.last_name}`,
        highest: `${_.round(maxAttendancePercentage, 2) * 100}%`,
        lowestStudent: `${minAttendanceStudent.first_name} ${minAttendanceStudent.last_name}`,
        lowest: `${_.round(minAttendancePercentage, 2) * 100}%`,
      };
    }

    render() {
      const summaryData = this.getSummaryData();

      return (
        <ReportSummaryContainer
          onClick={this.selectReport}
          >
          <span style={{fontWeight: 'bold', fontSize: '1.2em', paddingBottom: '3px'}}>{summaryData.title}</span>
          <SummaryRow>Number of Students: {summaryData.count}</SummaryRow>
          <SummaryRow>Mean: {summaryData.mean}</SummaryRow>
          <SummaryRow>Highest: {summaryData.highestStudent} ({summaryData.highest})</SummaryRow>
          <SummaryRow>Lowest: {summaryData.lowestStudent} ({summaryData.lowest})</SummaryRow>
          <Footer>{summaryData.subheading}</Footer>
        </ReportSummaryContainer>
      )
    }
}

export default ReportSummary;