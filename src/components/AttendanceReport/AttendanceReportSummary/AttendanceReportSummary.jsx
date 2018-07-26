import styled from 'styled-components';
import { lighten } from 'polished';
import React from 'react';

import { DataConsumer } from '../../../DataProvider';
import {
  ReportSummaryContainer,
} from '../../PatternLibrary';
import {
  fonts,
} from '../../PatternLibrary/constants';

const SummaryTable = styled.table`
  margin: 20px auto;
  border-collapse: collapse;
`;

const SummaryCell = styled.td`
  border: 1px solid #a2a2a2;
  padding: 10px;
`;

const individualDataMargin = "20px";

const IndividualDatalabel = styled.div`
  margin: ${individualDataMargin} auto;
  font-size: ${fonts.medium};
  color: ${lighten(0.6, 'black')};
  text-align: center;
`

const IndividualData = styled.div`
  margin: ${individualDataMargin} auto;
  font-size: ${fonts.huge};
  text-align: center;
`;

class AttendanceReportSummary extends React.PureComponent {
  handleSelectReport = (e) => {
    e.preventDefault();
    this.props.selectReport(this.props.reportData.query);
  }

  formatTitle = title => {
    return title.split(":").map((text, i) => {
      return (
        <span key={text}>{text}{i === 0 ? ":" : null}</span>
      )
    });
  }

  render() {
    const { reportData, getReportById } = this.props;
    const { id: reportId } = reportData;
    const report = getReportById(reportId);

    let reportNodes = null;
    const summaryData = this.props.summarizeAttendanceReport(reportData);
    if (summaryData.singleRecordAttendanceComposite) {
      reportNodes = (
        <div>
          <IndividualData>{summaryData.singleRecordAttendanceComposite}%</IndividualData>
          <IndividualDatalabel>{summaryData.singleRecordAttendanceCompositeLabel}</IndividualDatalabel>
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
        handleSelectReport={this.handleSelectReport}
        handleDeleteClick={!!reportId ? this.props.handleDeleteClick : null}
        handleSaveClick={!reportId ? this.props.handleSaveClick : null}
        handleShareClick={this.props.handleShareClick}
        report={report}
        reportData={reportData}
        >
        {reportNodes}
      </ReportSummaryContainer>
    )
  }
}

export default props => (
  <DataConsumer>
    {({summarizeAttendanceReport, getReportById}) => (
      <AttendanceReportSummary
        summarizeAttendanceReport={summarizeAttendanceReport}
        getReportById={getReportById}
        {...props}
      />
    )}
  </DataConsumer>
);