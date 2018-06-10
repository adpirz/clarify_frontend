import _ from 'lodash';
import React from 'react';
import { DataConsumer } from '../../DataProvider';
import { ReportHeading, ReportCardContainer } from '../';
import GradeReportSummary from './GradeReportSummary/GradeReportSummary';


class GradeReport extends React.Component {

  handleSaveReport = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const { reportCrumbs, initialQuery } = this.props;
    const currentReportQuery = _.get(_.last(reportCrumbs), 'query', initialQuery);
    this.props.saveReport(currentReportQuery);
  }

  handleDeleteReport = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const { reportCrumbs, initialQuery, getReportByQuery } = this.props;
    const currentReportQuery = _.get(_.last(reportCrumbs), 'query', initialQuery);
    const { id } = getReportByQuery(currentReportQuery);
    this.props.deleteReport(id);
  }

  render() {
    const {
      initialQuery,
      displayMode,
      selectReport,
      getReportByQuery,
    } = this.props;

    if (displayMode === 'summary') {
      const report = getReportByQuery(initialQuery);
      return (
        <GradeReportSummary
          selectReport={selectReport}
          report={report}
          deleteReport={this.handleDeleteReport}
          saveReport={this.handelSaveReport}
        />
      )
    }

    const {
      pushReportLevel,
      popReportLevel,
      reportCrumbs,
      deselectReport,
    } = this.props;

    const currentReportQuery = _.get(_.last(reportCrumbs), 'query', initialQuery);
    const {
      data: currentReportData,
      id
    } = getReportByQuery(currentReportQuery);

    const {
      title: currentReportTitle,
    } = getReportByQuery(initialQuery);

    return (
      <div style={{width: '100%'}}>
        <ReportHeading title={currentReportTitle} crumbs={reportCrumbs} />
        <ReportCardContainer
          children={currentReportData}
          pushReportLevel={pushReportLevel}
          popReportLevel={reportCrumbs.length ? popReportLevel : null}
          deselectReport={deselectReport}
          saveReport={id ? null : this.handleSaveReport}
          deleteReport={id ? this.handleDeleteReport : null}
        />
      </div>
    );
  }
}

export default (props) => (
  <DataConsumer>
    {({getReportByQuery, deselectReport, saveReport, deleteReport}) => (
      <GradeReport
        getReportByQuery={getReportByQuery}
        deselectReport={deselectReport}
        saveReport={saveReport}
        deleteReport={deleteReport}
        {...props}
      />
    )}
  </DataConsumer>
);