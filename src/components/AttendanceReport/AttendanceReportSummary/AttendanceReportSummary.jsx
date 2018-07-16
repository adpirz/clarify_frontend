import styled from 'styled-components';
import { lighten } from 'polished';
import _ from 'lodash';
import React from 'react';

import { DataConsumer } from '../../../DataProvider';
import {
  ReportSummaryContainer,
  ReportActions,
} from '../../PatternLibrary';
import {
  fonts,
} from '../../PatternLibrary/constants';

const Title = styled.span`
  font-weight: bold;
  font-size: 1.2em;
  padding-bottom: 3px;
`;

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

const Footer = styled.div`
  padding: 5px;
  font-size: 0.8em;
  font-style: italic;
  margin-top: 15px;
  color: ${lighten(.6, 'black')};
  border-top: 1px solid ${lighten(.8, 'black')};
  text-align:right;
`

class AttendanceReportSummary extends React.PureComponent {
  handleSelectReport = (e) => {
    e.preventDefault();
    this.props.selectReport(this.props.report.query);
  }

  formatTitle = title => {
    return title.split(":").map((text, i) => {
      return (
        <span key={text}>{text}{i === 0 ? ":" : null}</span>
      )
    });
  }

  render() {
    const { report } = this.props;
    const { subheading, title } = report;
    let reportNodes = null;
    const summaryData = this.props.summarizeAttendanceReport(report);
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
        onClick={this.handleSelectReport}
        >
        <ReportActions
          handleDeleteClick={!!_.get(this.props.report, 'id') ? this.props.handleDeleteClick : null}
          handleSaveClick={!_.get(this.props.report, 'id') ? this.props.handleSaveClick : null}
          handleShareClick={this.props.handleShareClick}
        />
        <Title>{this.formatTitle(title)}</Title>
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