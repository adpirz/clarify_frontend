import styled from 'styled-components';
import { lighten, darken } from 'polished';

import React from 'react';
import { DataConsumer } from '../../../DataProvider';
import { ReportSummaryContainer } from '../../PatternLibrary';
import {
  fonts,
  colors,
} from '../../PatternLibrary/constants';

const Title = styled.span`
  font-weight: bold;
  font-size: 1.2em;
  padding-bottom: 3px;
  width: 80%;
`;

const SummaryTable = styled.table`
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

class AttendanceReportSummary extends React.PureComponent {
  handleSelectReport = (e) => {
    e.preventDefault();
    this.props.selectReport(this.props.report.query);
  }

  getDeleteIcon = () => {
    const { report: { id }, deleteReport } = this.props;
    if (!id) {
      return null;
    }

    return (
      <ActionIcon
        className="fas fa-times"
        color={colors.warningRed}
        onClick={deleteReport}
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
        onClick={this.props.saveReport}
      />
    );
  }

  render() {
    const { report } = this.props;
    const { subheading, title } = report;
    let reportNodes = null;
    const summaryData = this.props.summarizeAttendanceReport(report);
    if (summaryData.singleRecordAttendanceComposite) {
      reportNodes = (
        <div>
          <IndividualData>{summaryData.singleRecordAttendanceComposite}</IndividualData>
          <IndividualData>{summaryData.singleRecordAttendanceOther}</IndividualData>
        </div>
      );
    } else {
      reportNodes = (
        <SummaryTable>
          <tbody>
            <tr><SummaryCell>Students:</SummaryCell><SummaryCell>{summaryData.count}</SummaryCell></tr>
            <tr><SummaryCell>Highest:</SummaryCell><SummaryCell>{summaryData.maxAttendanceStudent}</SummaryCell></tr>
            <tr><SummaryCell>Lowest:</SummaryCell><SummaryCell>{summaryData.minAttendanceStudent}</SummaryCell></tr>
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

export default props => (
  <DataConsumer>
    {({summarizeAttendanceReport}) => (
      <AttendanceReportSummary
        summarizeAttendanceReport={summarizeAttendanceReport}
        {...props}
      />
    )}
  </DataConsumer>
);