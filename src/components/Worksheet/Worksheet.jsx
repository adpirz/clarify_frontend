import _ from 'lodash';
import React from 'react';
import Modal from '@material-ui/core/Modal';
import { DataConsumer } from '../../DataProvider';
import { Loading, Error } from '../PatternLibrary/';
import { AttendanceReport, GradeReport, ShareReportForm } from '../';
import {
  fonts,
} from '../PatternLibrary/constants';

const GROUP_REGEX = /group=[a-z]+/g;
const GROUP_ID_REGEX = /group_id=[0-9]+/g;
const COURSE_ID_REGEX = /course_id=[0-9]+/g;
const CATEGORY_ID_REGEX = /category_id=[0-9]+/g;

class Worksheet extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      reportCrumbs: [],
      showShareReportModal: false,
      parentReportQuery: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.selectedReportQuery !== nextProps.selectedReportQuery) {
      this.setState({reportCrumbs: []});
    }
  }

  getLatestQueryParameters = () => {
    const { selectedReportQuery } = this.props;
    const mostRecentQuery = _.get(_.last(this.state.reportCrumbs), 'query', selectedReportQuery);

    const groupMatch = mostRecentQuery.match(GROUP_REGEX);
    const groupIdMatch = mostRecentQuery.match(GROUP_ID_REGEX);
    const courseIdMatch = mostRecentQuery.match(COURSE_ID_REGEX);
    const categoryIdMatch = mostRecentQuery.match(CATEGORY_ID_REGEX);

    const initialParameters = {};
    if (groupMatch) {
      initialParameters.group = groupMatch[0].split('=')[1];
    }
    if (groupIdMatch) {
      initialParameters.groupId = groupIdMatch[0].split('=')[1];
    }
    if (courseIdMatch) {
      initialParameters.courseId = courseIdMatch[0].split('=')[1];
    }
    if (categoryIdMatch) {
      initialParameters.categoryId = categoryIdMatch[0].split('=')[1];
    }

    return initialParameters;

  }

  handleReportCrumbPop = () => {
    const {reportCrumbs} = this.state;
    const newReportCrumbs = _.reject(reportCrumbs, {query: _.last(reportCrumbs).query});
    this.setState({reportCrumbs: newReportCrumbs});
  }

  handleReportCrumbPush = (depth, depthId, label) => {
    const { groupId, courseId, categoryId } = this.getLatestQueryParameters();
    const newQueryParameters = {
      reportType: 'grades',
      group: 'student',
      // We always want a studentId for crumb reports so we can pull it off of
      // the record that was just selected, or the previous report's
      groupId: depth === 'student' ? depthId : groupId,
      courseId,
      categoryId,
    }
    if (depth !== 'student') {
      // This means we clicked on a record that represents a course or category.
      // Let's add that to what's already in the query.
      newQueryParameters[`${depth}Id`] = depthId;
    }

    const query = this.props.generateReportQuery(newQueryParameters);

    const { reportCrumbs } = this.state;
    reportCrumbs.push({label, query});
    this.setState({reportCrumbs});

    this.props.submitReportQuery(query);
  }

  handleShareReportClick = (targetStaff) => {
    this.props.shareReport(this.state.parentReportQuery, targetStaff)
    .then(() => {
      this.setState({
        showShareReportModal: false,
        parentReportQuery: '',
      });
    })
  }

  toggleShareReportModal = (parentReportQuery) => {
    if (!this.state.showShareReportModal) {
      this.props.getStaff().then(() => {
        this.setState({
          showShareReportModal: true,
          parentReportQuery,
        });
      })
    } else {
      this.setState({
        showShareReportModal: false,
        parentReportQuery: '',
      });
    }
  }

  render() {
    const {
      reportDataList,
      isLoadingReport,
      selectedReportQuery,
      reportError,
    } = this.props;

    let worksheetBody = null;

    if (isLoadingReport) {
      return <Loading />;
    } else if (reportError) {
      worksheetBody = (
        <Error>
          {reportError}
        </Error>
      )
    } else if (_.isEmpty(reportDataList)) {
      worksheetBody = (
        <div>
          <p>
            No Reports saved at the moment. Try typing a student or class name in the
            search bar <span role="img" aria-label="pointing up to search bar">☝️</span>
          </p>
        </div>
      );
    } else if (selectedReportQuery) {
      const reportForDisplay = _.find(reportDataList, {query: selectedReportQuery});
      const { type } = reportForDisplay;
      if (type === 'attendance') {
        worksheetBody = (
          <AttendanceReport
            report={reportForDisplay}
            showShareReportModal={this.toggleShareReportModal}
          />
        );
      } else if (type === 'grades') {
        worksheetBody = (
          <GradeReport
            initialQuery={selectedReportQuery}
            handlePushReportLevel={this.handleReportCrumbPush}
            handlePopReportLevel={this.handleReportCrumbPop}
            reportCrumbs={this.state.reportCrumbs}
            showShareReportModal={this.toggleShareReportModal}
          />
        );
      }
    }
    else {
      worksheetBody = _.map(reportDataList, (reportDataObject) => {
        const { type, query, id, isTopLevelReport } = reportDataObject;
        if ( !(id || isTopLevelReport)) {
          return;
        }
        if (type === 'attendance') {
          return (
            <AttendanceReport
              displayMode="summary"
              report={reportDataObject}
              key={reportDataObject.query}
              selectReport={this.props.selectReport}
              showShareReportModal={this.toggleShareReportModal}
            />
          );
        } else if (type === 'grades') {
          return (
            <GradeReport
              initialQuery={query}
              displayMode="summary"
              key={reportDataObject.query}
              selectReport={this.props.selectReport}
              showShareReportModal={this.toggleShareReportModal}
            />
          );
        }
      });
    }
    const { first_name, last_name } = this.props.user;
    return (
      <div>
        <div>
          <span style={{fontSize: fonts.huge}}>
            {this.props.selectedReportQuery ? null : `${first_name} ${last_name}'s Worksheet`}
          </span>
        </div>
        <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
            padding: '20px 0',
            flexWrap: 'wrap'}}>
          {worksheetBody}
        </div>
        <Modal
          open={this.state.showShareReportModal}
          onClose={this.toggleShareReportModal}
          onEscapeKeyDown={this.toggleShareReportModal}>
          <ShareReportForm
            shareReport={this.handleShareReportClick}
            closeModal={this.toggleShareReportModal}
          />
        </Modal>
      </div>
    );
  }
}

export default props => (
  <DataConsumer>
    {({
      user,
      reportDataList,
      isLoadingReport,
      selectReport,
      selectedReportQuery,
      submitReportQuery,
      generateReportQuery,
      errors,
      getStaff,
      shareReport,
    }) => (
      <Worksheet
        user={user}
        getStaff={getStaff}
        reportDataList={reportDataList}
        isLoadingReport={isLoadingReport}
        selectReport={selectReport}
        selectedReportQuery={selectedReportQuery}
        submitReportQuery={submitReportQuery}
        generateReportQuery={generateReportQuery}
        reportError={errors.reportError}
        shareReport={shareReport}
        {...props}
      />
    )}
  </DataConsumer>
)