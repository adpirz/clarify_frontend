import _ from 'lodash';
import React from 'react';
import { DataConsumer } from '../../DataProvider';
import { ReportSummaryContainer } from '../PatternLibrary';
import { ReportCrumbs, ReportCardContainer } from '..';


class GradeReport extends React.Component {
  render() {
    const {
      initialQuery,
      displayMode,
    } = this.props;

    if (displayMode === 'summary') {
      const handleSelectReport = () => {
        this.props.selectReport(initialQuery);
      };
      return (
        <ReportSummaryContainer onClick={handleSelectReport}> DISPLAY MODE!</ReportSummaryContainer>
      )
    }

    const {
      pushReportLevel,
      popReportLevel,
      reportCrumbs,
      deselectReport,
      getReportByQuery,
    } = this.props;

    const currentReportQuery = _.get(_.last(reportCrumbs), 'query', initialQuery);
    const {
      data: currentReportData,
    } = getReportByQuery(currentReportQuery);

    const {
      title: currentReportTitle,
    } = getReportByQuery(initialQuery);

    return (
      <div style={{width: '100%'}}>
        <ReportCrumbs title={currentReportTitle} crumbs={reportCrumbs} />
        <ReportCardContainer
          children={currentReportData}
          pushReportLevel={pushReportLevel}
          popReportLevel={reportCrumbs.length ? popReportLevel : null}
          deselectReport={deselectReport}
        />
      </div>
    );
  }
}

export default (props) => (
  <DataConsumer>
    {({getReportByQuery, deselectReport}) => (
      <GradeReport
        getReportByQuery={getReportByQuery}
        deselectReport={deselectReport}
        {...props}
      />
    )}
  </DataConsumer>
);