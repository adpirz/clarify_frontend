import _ from 'lodash';
import React from 'react';
import { Button, Logo, Loading } from './components/PatternLibrary';
import colors from './components/PatternLibrary/colors';
import { PromiseState } from 'react-refetch';
import { ReportFetcher, ApiFetcher } from './fetchModule';
import {
  LoginForm,
  Report,
  ReportQueryBuilder,
  Worksheet
} from './components/index';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      reports: [],
      currentReportQuery: '',
      selectedReport: null,
      currentUser: null,
      loading: false,
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
    ApiFetcher.delete('session');
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

  deleteReport = (report) => {
    ApiFetcher.delete('report', report.report_id).then((successful) => {
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
      loading: true,
    });
    ReportFetcher.get(queryString).then((resp) => {
      const newState = {
        loading: false,
      }
      if (!_.isEmpty(resp.data)) {
        newState.selectedReport = resp;
      }
      this.setState(newState);
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
      return (
        <div>
          <Report
            report={selectedReport}
            students={students}
            back={this.clearReport}
            saveReport={this.saveReport}
            show={!!selectedReport}
          />
          <Worksheet
            worksheet={_.get(this.props.worksheetGet, 'value.data[0]')}
            currentUser={this.state.currentUser}
            students={students}
            selectReport={this.selectReport}
            deleteReport={this.deleteReport}
            show={!selectedReport}/>
        </div>
    );
  }

  logUserIn = (credentials) => {
    this.setState({loading: true});
    return ApiFetcher.post('session', credentials).then((resp) => {
      if (resp.data) {
        return ApiFetcher.get('user/me/').then((resp) => {
          if (_.get(resp, 'id')) {
            this.setState({
              currentUser: resp,
              loading: false,
            });
            this.requestQueryObjects();
            return resp;
          }
        });
      }
      return resp;
    })
  }

  getPageBody = () => {
    if (!this.state.currentUser) {
      return <LoginForm logUserIn={this.logUserIn} />;
    }
    const promiseValues = this.getPromiseValues();

    if (this.state.loading || !promiseValues) {
      return (
        <Loading />
      );
    }
    return (
      <div style={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: '1',
          backgroundColor: colors.accent,
        }}>
        <ReportQueryBuilder
          {...promiseValues}
          submitReportQuery={this.submitReportQuery}
        />
        <div style={{
            margin: '20px 25px',
            padding: '25px',
            border: '1px solid lightgrey',
            backgroundColor: colors.white,
            borderRadius: '10px',
            flexGrow: '1',
          }}>
          {this.getReportOrWorksheet()}
        </div>
      </div>
    );
  }

  render() {
    const username = _.get(this.state.currentUser, 'username');
    return (
      <div style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}>
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 20px',
            borderBottom: '1px solid lightgrey',
            minHeight: '46px',
          }}>
          <Logo alt="Clarify Logo" />
          <div style={{
              borderLeft: '2px solid lightgrey',
              paddingLeft: '25px',
            }}>
            {this.state.currentUser &&
              <span>
                <i className="fas fa-user" style={{margin: '0 10px'}}/>
                User: {username}
              </span>
            }
            {this.state.currentUser &&
              <Button
                onClick={this.logout}>
                Logout
              </Button>
            }
          </div>
        </div>
        {this.getPageBody()}
      </div>
    );
  }
}

export default App;
