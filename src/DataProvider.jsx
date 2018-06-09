import _ from 'lodash';
import React from 'react';
import { ApiFetcher, ReportFetcher } from './fetchModule';


const Context = React.createContext();

export class DataProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      isLoading: false,
      isLoadingReport: false,
      errors: {
        queryError: null,
        loginError: null,
      },
      students: null,
      sections: null,
      gradeLevels: null,
      reportDataList: null,
      worksheet: null,
      selectedReportQuery: null,
      selectReport: this.selectReport,
      deselectReport: this.deselectReport,
      getReportDataForWorksheet: this.getReportDataForWorksheet,
      saveReport: this.saveReport,
      deleteReport: this.deleteReport,
      initializeUser: this.initializeUser,
      logUserIn: this.logUserIn,
      logUserOut: this.logUserOut,
      getNewBaseReport: this.getNewBaseReport,
      submitReportQuery: this.submitReportQuery,
      getReportByQuery: this.getReportByQuery,
    };
  }

  componentDidMount() {
    this.setState({isLoading: true});
    this.initializeUser()
    .then((resp) => {
      if (resp.status !== 404) {
        this.hydrateUserData();
      } else {
        return;
      }
    })
  }

  hydrateUserData = () => {
    this.setState({isLoading: true});
    return this.getQueryObjects()
    .then(this.getWorksheet)
    .then((resp) => {
      const worksheet = _.head(resp.body.data);
      this.getReportDataForWorksheet(worksheet).then((resp) => {
        this.setState({isLoading: false});
      });
    })
  }

  initializeUser = () => {
    return ApiFetcher.get('user/me').then((resp) => {
      const newState = {
        isLoading: false,
      };
      if (resp.status !== 404) {
        newState.user = resp.body;
      }
        this.setState(newState);
        return resp;
    })
  }

  logUserIn = (credentials) => {
    this.setState({isLoading: true});
    ApiFetcher.post('session', credentials).then((resp) => {
      this.setState((prevState) => {
        const newState = {isLoading: false};
        if (resp.status === 200 || resp.status === 201) {
          newState.user = resp.body;
          this.hydrateUserData();
        } else {
          newState.errors = {...prevState.errors, ...{loginError: `There was an error with your username and password.
            Shoot an email over to help@clarify.com and we'll take a look.`}}
        }
        return newState;
      })
    });
  }

  logUserOut = () => {
    ApiFetcher.delete('session').then(() => {
      window.location.reload();
    });
  }

  getQueryObjects = () => {
    const promises = [];
    promises.push(ApiFetcher.get('student').then((resp) => {
      if (resp.status !== 404) {
        this.setState({students: resp.body.data});
      }
    }));
    promises.push(ApiFetcher.get('section').then((resp) => {
      if (resp.status !== 404) {
        this.setState({sections: resp.body.data});
      }
    }));
    promises.push(ApiFetcher.get('grade-level').then((resp) => {
      if (resp.status !== 404) {
        this.setState({gradeLevels: resp.body.data});
      }
    }));

    return Promise.all(promises);
  }

  getWorksheet = () => {
    return ApiFetcher.get('worksheet').then((resp) => {
      if (resp.body) {
        this.setState({
          worksheet: _.head(resp.body.data) || {},
        });
      }
      return resp;
    });
  }

  getReportDataForWorksheet = (worksheet) => {
    if (!worksheet || !worksheet.reports.length) {
      return Promise.resolve({});
    }
    const reportDataFetchPromises = [];
    _.forEach(worksheet.reports, (report) => {
      reportDataFetchPromises.push(ReportFetcher.get(report.id));
    });
    return Promise.all(reportDataFetchPromises).then(reportDataList => {
      this.setState({
        reportDataList,
      });
    })
  }

  selectReport = (reportQuery) => {
    this.setState({selectedReportQuery: reportQuery});
  }

  deselectReport = () => {
    this.setState({selectedReportQuery: null});
  }

  saveReport = (query) => {
    this.setState({isLoading: true});
    ApiFetcher.post('report', {query}).then((resp) => {
      const newReport = _.get(resp, 'body.data');
      if (newReport) {
        ApiFetcher.post('worksheet-membership', {report_id: newReport.id}).then((resp) => {
          ReportFetcher.get(newReport.id)
          .then((newReportData) => {
            this.setState((prevState) => {
              const newReportDataList = _.map(prevState.reportDataList, (rd) => {
                return rd.query === newReportData.query ? newReportData : rd;
              });
              return {
                reportDataList: newReportDataList,
                selectedReportQuery: null,
                isLoading: false,
              }
            });
          })
        })
      }
    });
  }

  deleteReport = (reportId) => {
    this.setState({isLoading: true});
    return ApiFetcher.delete('report', reportId).then(() => {
      this.setState((prevState) => {
        const newReportDataList = _.reject(prevState.reportDataList, {id : reportId});
        return {
          reportDataList: newReportDataList,
          selectedReportQuery: null,
          isLoading: false,
        };
      });
    });
  }

  getNewBaseReport = (queryString) => {
    const existingReport = this.getReportByQuery(queryString);
    if (existingReport) {
      this.setState((prevState) => {
        return {
          errors: {...prevState.errors, ...{queryError: 'You already have a saved report for that query'}},
        };
      });
      return;
    } else {
      this.submitReportQuery(queryString).then((resp) => {
        this.setState((prevState) => {
          const newState = {
            selectedReportQuery: queryString,
          };
          if (!_.get(resp, 'data.length')) {
            newState.errors = {...prevState.errors, ...{reportError: "We couldn't find any data for that group. Try a different section or grade level."}};
          }
          return newState;
        });
      });
    }
  }

  submitReportQuery = (queryString) => {
    this.setState({
      isLoadingReport: true,
    });
    const existingReport = this.getReportByQuery(queryString);
    if (existingReport) {
      this.setState({
        isLoadingReport: false,
      })
      return existingReport;
    }
    return ReportFetcher.get(queryString).then((resp) => {
      this.setState((prevState) => {
        const newState = {
          isLoadingReport: false,
        };
        if (_.get(resp, 'data.length')) {
          const oldReportDataList = prevState.reportDataList || [];
          newState.reportDataList = [...oldReportDataList, resp];
        }
        return newState;
      });
      return resp;
    });
  }

  getReportByQuery = (queryString) => {
    if (!queryString) {
      return null;
    }
    return _.find(this.state.reportDataList, {query: queryString});
  }

  render() {
    const {children} = this.props;
    return (
      <Context.Provider value={this.state}>
        {children}
      </Context.Provider>
    )
  }
}

export const DataConsumer = Context.Consumer;