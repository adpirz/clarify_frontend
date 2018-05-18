import _ from 'lodash';

import React from 'react';
import styled from 'styled-components';
import { darken } from 'polished';
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

class ReportSummary extends React.PureComponent {
  constructor(props) {
    super(props);

    this.selectReport = this.selectReport.bind(this);
  }
    selectReport() {
      this.props.selectReport(this.props.report);
    }

    getSummaryData = () => {
      const { data } = _.get(this.props, 'report');
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

      const maxAttendanceStudent = _.find(this.props.students, {source_object_id: maxAttendanceStudentId});
      const minAttendanceStudent = _.find(this.props.students, {source_object_id: minAttendanceStudentId});

      return {
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
          <div>Number of Students: {summaryData.count}</div>
          <div>Mean: {summaryData.mean}</div>
          <div>Highest: {summaryData.highestStudent} ({summaryData.highest})</div>
          <div>Lowest: {summaryData.lowestStudent} ({summaryData.lowest})</div>
        </ReportSummaryContainer>
      )
    }
}

export default ReportSummary;