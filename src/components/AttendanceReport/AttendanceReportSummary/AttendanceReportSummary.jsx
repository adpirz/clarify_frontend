import _ from 'lodash';
import styled from 'styled-components';
import { lighten } from 'polished';
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
  text-align: center;
`

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
    const { title, id: report_id } = reportData;
    const { shared_by, shared_with } = getReportById(report_id);

    let shareByNode = null;
    let shareWithNode = null;
    if (shared_by) {
      shareByNode = (
        <span  style={{opacity: '.5'}} key="share_by">
          Shared by: {shared_by.staff}
        </span>
      );
    }
    if (shared_with && shared_with.length) {
      const sharedWithNames = _.map(shared_with, 'staff').join(', ');
      shareWithNode = (
        <span
          title={sharedWithNames}
          style={{opacity: '.5'}}
          key="share_with">
          Shared with {shared_with.length} educator{shared_with.length > 1 ? 's' : null}
        </span>
      );
    }

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
        onClick={this.handleSelectReport}
        >
        <ReportActions
          handleDeleteClick={!!report_id ? this.props.handleDeleteClick : null}
          handleSaveClick={!report_id ? this.props.handleSaveClick : null}
          handleShareClick={this.props.handleShareClick}
        />
        <Title>{this.formatTitle(title)}</Title>
        {reportNodes}
        {shareWithNode || shareByNode ? <Footer>{shareByNode} <br /> {shareWithNode}</Footer> : null }
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