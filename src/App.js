import _ from 'lodash';
import React from 'react';
import { Button, Logo } from './components/PatternLibrary';
import { PromiseState } from 'react-refetch';
import { ReportFetcher } from './fetchModule';
import {
  LoginForm,
  Report,
  ReportQueryBuilder,
} from './components/index';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      reports: [],
      currentReportQuery: '',
      selectedReport: null,
    };
  }

  componentDidMount() {
    this.props.lazyUserGet();
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.userIsAuthenticated(nextProps) && !this.queryRequestsMade(nextProps)) {
      // User is signed in, so let's make our object api calls.
      this.requestQueryObjects();
    }
    const oldSessionValue = _.get(this.props.sessionGet, 'value');
    const newSessionValue = _.get(nextProps.sessionGet, 'value');
    if (newSessionValue && oldSessionValue !== newSessionValue) {
      this.props.lazyUserGet();
    }
    const oldWorksheetValue = _.get(this.props.worksheetGet, 'value');
    const newWorksheetValue = _.get(nextProps.worksheetGet, 'value');
    if (newWorksheetValue && oldWorksheetValue !== newWorksheetValue) {
      const reportsForWorksheet = _.get(newWorksheetValue, 'data[0].reports');
      const reportDataFetchPromises = [];
      _.forEach(reportsForWorksheet, (report) => {
        reportDataFetchPromises.push(ReportFetcher.get(report.id));
      });
      Promise.all(reportDataFetchPromises).then(reportDataList => {
        this.setState({reportDataList});
      })
    }

    const oldReportDataGet = _.get(this.props.reportDataGet, 'value');
    const newReportDataGet = _.get(nextProps.reportDataGet, 'value');
    if (newReportDataGet && oldReportDataGet !== newReportDataGet) {
      this.setState({
        selectedReport: newReportDataGet,
      });
    }
  }

  userIsAuthenticated = (props) => {
    const userGetStatus = _.get(props, 'userGet.meta.response.status');
    const sessionCreateStatus = _.get(props, 'sessionPost.meta.response.status');
    return userGetStatus === 200 || sessionCreateStatus === 200 || sessionCreateStatus === 201;
  }

  requestQueryObjects = () => {
    const {
      lazyStudentGet,
      lazySectionGet,
      lazyGradeLevelGet,
      lazySiteGet,
      lazyWorksheetGet,
    } = this.props;

    lazyWorksheetGet();
    lazyStudentGet();
    lazySectionGet();
    lazyGradeLevelGet();
    lazySiteGet();
  }

  queryRequestsMade = (props) => {
    const { siteGet, gradeLevelGet, sectionGet, studentGet, worksheetGet } = props;
    return !!(siteGet && gradeLevelGet && sectionGet && studentGet && worksheetGet);
  }

  queryRequestsFulfilled = (props) => {
    const { siteGet, gradeLevelGet, sectionGet, studentGet, worksheetGet } = props;
    const allRequests = PromiseState.all([siteGet, gradeLevelGet, sectionGet, studentGet, worksheetGet]);
    return allRequests.fulfilled;
  }

  getPromiseValues = () => {
    if (!this.queryRequestsMade(this.props) || !this.queryRequestsFulfilled(this.props)) {
      return null;
    }
    const {
      studentGet,
      gradeLevelGet,
      sectionGet,
      siteGet,
      userGet
    } = this.props;

    const promiseValues = {
      students: _.get(studentGet, 'value.data', []),
      gradeLevels: _.get(gradeLevelGet, 'value.data', []),
      sections: _.get(sectionGet, 'value.data', []),
      sites: _.get(siteGet, 'value.data', []),
      user: _.get(userGet, 'value', {}),
    };

    return promiseValues;
  }

  logout = () => {
    this.props.lazyUserLogout();
    window.location.reload();
  }

  saveReport = () => {
    this.props.lazyReportObjectPost(this.state.currentReportQuery);
  }

  submitReportQuery = (group, groupId, category, minDate, maxDate) => {
    this.setState({
      currentReportQuery: `group=${group}&group_id=${groupId}&category=${category}&from_date=${minDate}&to_date=${maxDate}`,
    });
    this.props.lazyReportDataGet(group, groupId, category, minDate, maxDate);
  }

  selectReport = (report) => {
    this.setState({selectedReport: report});
  }

  clearReport = () => {
    this.setState({
      selectedReport: null,
      currentReportQuery: null,
    });
  }

  getReportOrWorksheet = () => {
    const selectedReport = this.state.selectedReport;
    const { user, students } = this.getPromiseValues();
    if (selectedReport) {
      return (
        <Report
          report={selectedReport}
          students={students}
        />
      );
    }
    const { reportDataList } = this.state;
    if (_.isEmpty(reportDataList)) {
      return null;
    }
    return (
      <div style={{padding: '0 50px'}}>
        <div>
          <div>
            {user ? `${user.first_name} ${user.last_name}'s` : ''}&nbsp;Worksheet
          </div>
          <hr />
        </div>
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '20px 0',
            flexWrap: 'wrap'}}>
          {_.map(reportDataList, (reportDataObject) => {
            return (
              <Report
                displayMode="summary"
                students={students}
                report={reportDataObject}
                key={reportDataObject.report_d}
                selectReport={this.selectReport}
              />
            );
          })}
        </div>
      </div>
    );
  }

  getReportButtons = () => {
    if (!this.state.currentReportQuery && !this.state.selectedReport) {
      return null;
    }
    return (
      <div>
        <Button
          primary
          onClick={this.saveReport}
        >
        Save Report
        </Button>
        <Button onClick={this.clearReport}
        >
        Clear Report Results
        </Button>
      </div>
    );
  }

  render() {
    const promiseValues = this.getPromiseValues();

    if (!this.userIsAuthenticated(this.props)) {
      return <LoginForm lazySessionPost={this.props.lazySessionPost} />;
    }

    if (!promiseValues) {
      return null;
    }

    const username = _.get(promiseValues.user, 'username');
    return (
      <div>
        <div style={{display: 'flex', justifyContent: 'space-between', margin: '0 20px'}}>
          <Logo alt="Clarify Logo" />
          <div>
            <i className="fas fa-user" />
            <span style={{margin: '0 10px'}}>
              {username}
            </span>
            <Button
              onClick={this.logout}
            >
            Logout
            </Button>
          </div>
        </div>
        <hr />
        <ReportQueryBuilder
          {...promiseValues}
          lazyReportDataGet={this.props.lazyReportDataGet}
          submitReportQuery={this.submitReportQuery}
        />
      {this.getReportButtons()}
      {this.getReportOrWorksheet()}
    </div>
    );
  }
}

export default App;
