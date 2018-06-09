import _ from 'lodash';
import React from 'react';
import { DataConsumer } from '../../DataProvider';
import { generateReportQuery } from '../../utils';
import { Loading, Error } from '../PatternLibrary/';
import { AttendanceReport, GradeReport } from '../';
import {
  fonts,
} from '../PatternLibrary/constants';

const FROM_DATE_REGEX = /from_date=[0-9]+-[0-9]+-[0-9]+/g;
const TO_DATE_REGEX = /to_date=[0-9]+-[0-9]+-[0-9]+/g;
const GROUP_REGEX = /group=[a-z]+/g;
const GROUP_ID_REGEX = /group_id=[0-9]+/g;
const COURSE_ID_REGEX = /course_id=[0-9]+/g;
const CATEGORY_ID_REGEX = /category_id=[0-9]+/g;

class Worksheet extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      reportCrumbs: [],
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

    const fromDateMatch = mostRecentQuery.match(FROM_DATE_REGEX);
    const toDateMatch = mostRecentQuery.match(TO_DATE_REGEX);
    const groupMatch = mostRecentQuery.match(GROUP_REGEX);
    const groupIdMatch = mostRecentQuery.match(GROUP_ID_REGEX);
    const courseIdMatch = mostRecentQuery.match(COURSE_ID_REGEX);
    const categoryIdMatch = mostRecentQuery.match(CATEGORY_ID_REGEX);

    const initialParameters = {};
    if (fromDateMatch) {
      initialParameters.fromDate = fromDateMatch[0].split('=')[1];
    }
    if (toDateMatch) {
      initialParameters.toDate = toDateMatch[0].split('=')[1];
    }
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
    const { fromDate, toDate, groupId, courseId, categoryId } = this.getLatestQueryParameters();
    const newQueryParameters = {
      fromDate: fromDate,
      toDate: toDate,
      reportType: 'grades',
      group: 'student',
      // We always want a studentId for crumb reports so we can pull it off of
      // the record that was just selected, or the previous reports'
      groupId: depth === 'student' ? depthId : groupId,
      courseId,
      categoryId,
    }
    if (depth !== 'student') {
      // This means we clicked on a record that represents a course or category.
      // Let's add that to what's already in the query.
      newQueryParameters[`${depth}Id`] = depthId;
    }

    const query = generateReportQuery(newQueryParameters);

    const {reportCrumbs} = this.state;
    reportCrumbs.push({label, query});
    this.setState({reportCrumbs});

    this.props.submitReportQuery(query);
  }

  render() {
    const {
      reportDataList,
      isLoadingReport,
      worksheet,
      selectedReportQuery,
      reportError,
    } = this.props;
    let worksheetBody = null;
    if (isLoadingReport || !worksheet) {
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
            pushReportLevel={this.handleReportCrumbPush}
            popReportLevel={this.handleReportCrumbPop}
            reportCrumbs={this.state.reportCrumbs}
          />
        );
      } else if (type === 'grades') {
        worksheetBody = (
          <GradeReport
            initialQuery={selectedReportQuery}
            pushReportLevel={this.handleReportCrumbPush}
            popReportLevel={this.handleReportCrumbPop}
            reportCrumbs={this.state.reportCrumbs}
          />
        );
      }
    } else {
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
              />
            );
          } else if (type === 'grades') {
            return (
              <GradeReport
                initialQuery={query}
                displayMode="summary"
                key={reportDataObject.query}
                selectReport={this.props.selectReport}
              />
            );
          }
        });
      }
    return (
      <div>
        <div>
          <span style={{fontSize: fonts.huge}}>
            {this.props.selectedReportQuery ? null : worksheet.title}
          </span>
          <hr style={{margin: '0', width: '75%'}}/>
        </div>
        <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
            padding: '20px 0',
            flexWrap: 'wrap'}}>
          {worksheetBody}
        </div>
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
      worksheet,
      selectReport,
      selectedReportQuery,
      submitReportQuery,
      errors,
    }) => (
      <Worksheet
        user={user}
        reportDataList={reportDataList}
        isLoadingReport={isLoadingReport}
        worksheet={worksheet}
        selectReport={selectReport}
        selectedReportQuery={selectedReportQuery}
        submitReportQuery={submitReportQuery}
        reportError={errors.reportError}
        {...props}
      />
    )}
  </DataConsumer>
)