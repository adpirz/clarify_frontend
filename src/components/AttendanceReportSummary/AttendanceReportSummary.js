import _ from 'lodash';
import styled from 'styled-components';
import { lighten, darken } from 'polished';

import React from 'react';
import { ReportSummaryContainer } from '../PatternLibrary';
import {
  fonts,
  colors,
} from '../PatternLibrary/constants';

const Title = styled.span`
  font-weight: bold;
  font-size: 1.2em;
  padding-bottom: 3px;
`;

const SummaryTable = styled.table`
  width: 80%;
  margin: 20px auto;
  border-collapse: collapse;
`;

const SummaryCell = styled.td`
  border: 1px solid #a2a2a2;
  padding: 10px;
`;

const IndividualData = styled.div`
  margin: 0 auto;
  font-size: ${fonts.huge};
`;

const Footer = styled.div`
  padding: 5px;
  font-size: 0.8em;
  font-style: italic;
  margin-top: 15px;
  color: ${lighten(.6, 'black')};
  border-top: 1px solid ${lighten(.8, 'black')};
  text-align:right;
`

const ActionIcon = styled.i`
  position: absolute;
  top: 15px;
  right: 15px;
  color: ${(props) => {return props.color}};
  font-size: ${fonts.large};
  cursor: pointer;
  &:hover {
    color: ${(props) => {return darken(.1, props.color)}};
  }
`;

const COLUMN_CODE_FOR_SUMMARY = 4;

class AttendanceReportSummary extends React.PureComponent {
  handleSelectReport = (e) => {
    e.preventDefault();
    this.props.selectReport(this.props.report.query);
  }

  getSummaryData = () => {
    const { data, } = _.get(this.props, 'report');

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
      count: _.size(data),
      mean: `${_.round(sumAttendance / _.size(data) * 100, 2)}%`,
      highestStudent: `${maxAttendanceStudent.first_name} ${maxAttendanceStudent.last_name}`,
      highest: `${_.round(maxAttendancePercentage, 2) * 100}%`,
      lowestStudent: `${minAttendanceStudent.first_name} ${minAttendanceStudent.last_name}`,
      lowest: `${_.round(minAttendancePercentage, 2) * 100}%`,
    };
  }

  getIndividualData = () => {
    const { data } = _.get(this.props, 'report');
    const percentage = _.find(_.first(data).attendance_data, {column_code: COLUMN_CODE_FOR_SUMMARY}).percentage;
    return {
      mean: `${_.round(percentage * 100, 2)}%`,
    };
  }

  handleDeleteReport = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.deleteReport(this.props.report.id);
  }

  handleSaveReport = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.saveReport(this.props.report.query);
  }

  getDeleteIcon = () => {
    if (!this.props.report.id) {
      return null;
    }

    return (
      <ActionIcon
        className="fas fa-times"
        color={colors.warningRed}
        onClick={this.handleDeleteReport}
      />
    );
  }

  getSaveIcon = () => {
    if (this.props.report.id) {
      return null;
    }

    return (
      <ActionIcon
        className="fas fa-save"
        color={colors.primaryGreen}
        onClick={this.handleSaveReport}
      />
    );
  }

  render() {
    const { title, subheading } = _.get(this.props, 'report');
    let reportNodes = null;
    if (_.size(_.get(this.props, 'report.data')) === 1) {
      const individualData = this.getIndividualData();
      reportNodes = (
        <IndividualData>{individualData.mean}</IndividualData>
      );
    } else {
      const summaryData = this.getSummaryData();
      reportNodes = (
        <SummaryTable>
          <tbody>
            <tr><SummaryCell>Students:</SummaryCell><SummaryCell>{summaryData.count}</SummaryCell></tr>
            <tr><SummaryCell>Mean:</SummaryCell><SummaryCell>{summaryData.mean}</SummaryCell></tr>
            <tr><SummaryCell>Highest:</SummaryCell><SummaryCell>{summaryData.highestStudent} ({summaryData.highest})</SummaryCell></tr>
            <tr><SummaryCell>Lowest:</SummaryCell><SummaryCell>{summaryData.lowestStudent} ({summaryData.lowest})</SummaryCell></tr>
          </tbody>
        </SummaryTable>
      );
    }

    return (
      <ReportSummaryContainer
        onClick={this.handleSelectReport}
        >
        {this.getDeleteIcon()}
        {this.getSaveIcon()}
        <Title>{title}</Title>
        {reportNodes}
        <Footer>{subheading}</Footer>
      </ReportSummaryContainer>
    )
  }
}

export default AttendanceReportSummary;