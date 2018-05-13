import _ from 'lodash';
import React from 'react';
import { Button, Logo } from './components/PatternLibrary';
import { PromiseState } from 'react-refetch';
import { ReportFetcher, ApiFetcher } from './fetchModule';
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
      currentUser: null,
    };
  }

  componentDidMount = () => {
    ApiFetcher.get('user/me').then((resp) => {
      if (resp.id) {
        this.setState({currentUser: resp});
        this.requestQueryObjects();
      }
    })
  }

  componentWillReceiveProps = (nextProps) => {
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
    } = this.props;

    const promiseValues = {
      students: _.get(studentGet, 'value.data', []),
      gradeLevels: _.get(gradeLevelGet, 'value.data', []),
      sections: _.get(sectionGet, 'value.data', []),
      sites: _.get(siteGet, 'value.data', []),
    };

    return promiseValues;
  }

  logout = () => {
    this.props.lazyUserLogout();
    window.location.reload();
  }

  saveReport = () => {
    ApiFetcher.post('report', {query: this.state.currentReportQuery}).then((resp) => {
      if (resp.data) {
        ApiFetcher.post('worksheet-membership', {report_id: resp.data.id}).then((resp) => {
          this.setState({
            selectedReport: null,
            currentReportQuery: null,
          });
          this.props.lazyWorksheetGet();
        })
      }
    });
  }

  removeReport = () => {
    const report_id = _.get(this.state.selectedReport, 'report_id');
    ApiFetcher.delete('report', report_id).then((successful) => {
      if (successful) {
        this.setState({
          selectedReport: null,
        });
        this.props.lazyWorksheetGet();
      }
    });
  }

  submitReportQuery = (group, groupId, category, minDate, maxDate) => {
    const queryString = `group=${group}&group_id=${groupId}&category=${category}&from_date=${minDate}&to_date=${maxDate}`;
    this.setState({
      currentReportQuery: queryString,
    });
    ReportFetcher.get(queryString).then((resp) => {
      if (resp.data) {
        this.setState({
          selectedReport: resp,
        });
      }
    });
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
    const {students } = this.getPromiseValues();
    if (selectedReport) {
      return (
        <Report
          report={selectedReport}
          students={students}
        />
      );
    }
    const { reportDataList, currentUser } = this.state;
    if (_.isEmpty(reportDataList)) {
      return null;
    }
    return (
      <div style={{padding: '0 50px'}}>
        <div>
          <div>
            {currentUser ? `${currentUser.first_name} ${currentUser.last_name}'s` : ''}&nbsp;Worksheet
          </div>
          <hr />
        </div>
        <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
            padding: '20px 0',
            flexWrap: 'wrap'}}>
          {_.map(reportDataList, (reportDataObject) => {
            return (
              <Report
                displayMode="summary"
                students={students}
                report={reportDataObject}
                key={reportDataObject.report_id}
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
    const buttons = [(
      <Button key='clear' onClick={this.clearReport}>Back to Worksheet</Button>
    ),]
    if (!_.get(this.state.selectedReport, 'report_id')) {
        buttons.push(<Button key='save' primary onClick={this.saveReport}>Save Report</Button>)
    } else {
      buttons.push(<Button key='remove' primary onClick={this.removeReport}>Remove Report from Worksheet</Button>)
    }

    return buttons;
  }

  logUserIn = (credentials) => {
    ApiFetcher.post('session', credentials).then((resp) => {
      if (resp.data) {
        ApiFetcher.get('user/me/').then((resp) => {
          if (_.get(resp, 'id')) {
            this.setState({currentUser: resp});
            this.requestQueryObjects();
          }
        });
      }
    })
  }

  getPageBody = () => {
    if (!this.state.currentUser) {
      return <LoginForm logUserIn={this.logUserIn} />;
    }
    const promiseValues = this.getPromiseValues();

    if (!promiseValues) {
      return null;
    }

    return (
      <div>
        <ReportQueryBuilder
          {...promiseValues}
          submitReportQuery={this.submitReportQuery}
        />
        <div>
          {this.getReportButtons()}
        </div>
        {this.getReportOrWorksheet()}
      </div>
    );
  }

  render() {
    const username = _.get(this.state.currentUser, 'username');
    return (
      <div>
        <div style={{display: 'flex', justifyContent: 'space-between', margin: '0 20px'}}>
          <Logo alt="Clarify Logo" />
          <div>
            <i className="fas fa-user" />
            <span style={{margin: '0 10px'}}>
              {username}
            </span>
            {this.state.currentUser && <Button
              onClick={this.logout}
            >
            Logout
            </Button>}
          </div>
        </div>
        <hr />
        {this.getPageBody()}
      </div>
    );
  }
}

export default App;
