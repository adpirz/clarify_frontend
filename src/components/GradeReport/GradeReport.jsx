import _ from 'lodash';
import React from 'react';
import { DataConsumer } from '../../DataProvider';
import { ReportHeading, ReportCardContainer } from '../';
import GradeReportSummary from './GradeReportSummary/GradeReportSummary';


class GradeReport extends React.Component {

  handleSaveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const { reportCrumbs, initialQuery } = this.props;
    const currentReportQuery = _.get(_.last(reportCrumbs), 'query', initialQuery);
    this.props.saveReport(currentReportQuery);
  }

  handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const { reportCrumbs, initialQuery, getReportByQuery } = this.props;
    const currentReportQuery = _.get(_.last(reportCrumbs), 'query', initialQuery);
    const { id } = getReportByQuery(currentReportQuery);

    this.props.deleteReport(id);
  }

  handleShareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.props.handleShareClick(this.props.report.query);
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
          handleDeleteClick={this.handleDeleteClick}
          handleSaveClick={this.handleSaveClick}
          handleShareClick={this.handleShareClick}
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
        <ReportHeading
          title={currentReportTitle}
          crumbs={reportCrumbs}
          deselectReport={deselectReport}
          handleDeleteClick={!!id ? this.handleDeleteClick : null}
          handleSaveClick={!id ? this.handleSaveClick : null}
          handleShareClick={this.handleShareClick}
        />
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