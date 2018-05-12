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
      let maxAttendancePercentage = 0;
      let minAttendancePercentage = 1;
      let sumAttendance = 0;
      let maxAttendanceStudent = '';
      let minAttendanceStudent = '';
      _.forEach(data, (studentRow) => {
        const attendancePercentage = studentRow.attendance_data[33][1];
        sumAttendance += attendancePercentage;
        if (maxAttendancePercentage < attendancePercentage) {
          maxAttendancePercentage =  attendancePercentage;
          maxAttendanceStudent = studentRow.student_id;
        }
        if (minAttendancePercentage > attendancePercentage) {
          minAttendancePercentage =  attendancePercentage;
          minAttendanceStudent = studentRow.student_id;
        }
      });
      const randomStudent1 = this.props.students[_.random(0, this.props.students.length)];
      const randomStudent2 = this.props.students[_.random(0, this.props.students.length)];
      maxAttendanceStudent = _.find(this.props.students, {id: maxAttendanceStudent}) || randomStudent1;
      minAttendanceStudent = _.find(this.props.students, {id: minAttendanceStudent}) || randomStudent2;
      return {
        count: _.size(data),
        mean: _.round(sumAttendance / _.size(data), 2),
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