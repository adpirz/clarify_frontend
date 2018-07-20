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

class GradeReportSummary extends React.PureComponent {
  handleSelectReport = (e) => {
    e.preventDefault();
    this.props.selectReport(this.props.reportData.query);
  }

  render() {
    const { reportData, summarizeGradesReport, getReportById } = this.props;
    const { title, id: reportId } = reportData;
    const { shared_by, shared_with } = getReportById(reportId);

    let footerNodes = [];
    if (shared_by) {
      footerNodes.push(<span key="shared_by">Shared by: {shared_by.staff}</span>)
    }
    if (shared_with && shared_with.length) {
      footerNodes.push((
        <span key="shared_with">
          Shared with {shared_with.length} educator{shared_with.length > 1 ? 's' : null}
        </span>
      ));
    }

    let reportNodes = null;
    const summaryData = summarizeGradesReport(reportData);
    if (!summaryData.count) {
      reportNodes = (
        <IndividualData>{summaryData.value}</IndividualData>
      );
    } else {
      reportNodes = (
        <SummaryTable>
          <tbody>
            <tr><SummaryCell>Count:</SummaryCell><SummaryCell>{summaryData.count}</SummaryCell></tr>
            <tr><SummaryCell>Highest:</SummaryCell><SummaryCell>{summaryData.maxMeasureNode}</SummaryCell></tr>
            <tr><SummaryCell>Lowest:</SummaryCell><SummaryCell>{summaryData.minMeasureNode}</SummaryCell></tr>
          </tbody>
        </SummaryTable>
      );
    }
    return (
      <ReportSummaryContainer
        onClick={this.handleSelectReport}
        >
        <ReportActions
          handleDeleteClick={!!reportId ? this.props.handleDeleteClick : null}
          handleSaveClick={!reportId ? this.props.handleSaveClick : null}
          handleShareClick={this.props.handleShareClick}
        />
        <Title>{title}</Title>
        {reportNodes}
        {footerNodes.length ? <Footer>{footerNodes}</Footer> : null }
      </ReportSummaryContainer>
    )
  }
}

export default props => (
  <DataConsumer>
    {({summarizeGradesReport, getReportById}) => (
      <GradeReportSummary
        summarizeGradesReport={summarizeGradesReport}
        getReportById={getReportById}
        {...props}
      />
    )}
  </DataConsumer>
);