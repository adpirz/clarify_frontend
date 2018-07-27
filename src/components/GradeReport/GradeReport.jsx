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

    const { reportCrumbs, initialQuery, getReportDataByQuery } = this.props;
    const currentReportQuery = _.get(_.last(reportCrumbs), 'query', initialQuery);
    const { id } = getReportDataByQuery(currentReportQuery);

    this.props.deleteReport(id);
  }

  handleShareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const { reportCrumbs, initialQuery } = this.props;
    const currentReportQuery = _.get(_.last(reportCrumbs), 'query', initialQuery);
    this.props.showShareReportModal(currentReportQuery);
  }

  render() {
    const {
      initialQuery,
      displayMode,
      selectReport,
      getReportDataByQuery,
    } = this.props;

    if (displayMode === 'summary') {
      const reportData = getReportDataByQuery(initialQuery);
      return (
        <GradeReportSummary
          selectReport={selectReport}
          reportData={reportData}
          handleDeleteClick={this.handleDeleteClick}
          handleSaveClick={this.handleSaveClick}
          handleShareClick={this.handleShareClick}
        />
      )
    }

    const {
      handlePushReportLevel,
      handlePopReportLevel,
      reportCrumbs,
      deselectReport,
      getReportById,
    } = this.props;

    const currentReportQuery = _.get(_.last(reportCrumbs), 'query', initialQuery);
    const {
      data: currentReportData,
      id: reportId
    } = getReportDataByQuery(currentReportQuery);

    const {
      title: currentReportTitle,
    } = getReportDataByQuery(initialQuery);

    return (
      <div style={{width: '100%'}}>
        <ReportHeading
          reportId={reportId}
          getReportById={getReportById}
          title={currentReportTitle}
          crumbs={reportCrumbs}
          deselectReport={deselectReport}
          handleDeleteClick={reportId ? this.handleDeleteClick : null}
          handleSaveClick={!reportId ? this.handleSaveClick : null}
          handleShareClick={this.handleShareClick}
          handlePopReportLevel={reportCrumbs.length ? handlePopReportLevel : null}
        />
        <ReportCardContainer
          handlePushReportLevel={handlePushReportLevel}
          children={currentReportData}
        />
      </div>
    );
  }
}

export default (props) => (
  <DataConsumer>
    {({getReportDataByQuery, deselectReport, saveReport, deleteReport, getReportById}) => (
      <GradeReport
        getReportDataByQuery={getReportDataByQuery}
        deselectReport={deselectReport}
        saveReport={saveReport}
        deleteReport={deleteReport}
        getReportById={getReportById}
        {...props}
      />
    )}
  </DataConsumer>
);