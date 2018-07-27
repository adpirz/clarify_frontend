import _ from 'lodash';
import React from 'react';
import { ApiFetcher, ReportFetcher } from './fetchModule';


const Context = React.createContext();

const IDS_FOR_ATTENDANCE_COMPOSITE = [4, 10, 11];
const ATTENDANCE_COMPOSITE_LABEL = "PRESENT";

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
      selectedReportQuery: null,
      staff: [],
      selectReport: this.selectReport,
      deselectReport: this.deselectReport,
      saveReport: this.saveReport,
      deleteReport: this.deleteReport,
      initializeUser: this.initializeUser,
      logUserIn: this.logUserIn,
      logUserOut: this.logUserOut,
      getNewBaseReport: this.getNewBaseReport,
      submitReportQuery: this.submitReportQuery,
      getReportByQuery: this.getReportByQuery,
      generateReportQuery: this.generateReportQuery,
      getStaff: this.getStaff,
      shareReport: this.shareReport,
      summarizeAttendanceReport: this.summarizeAttendanceReport,
      summarizeGradesReport: this.summarizeGradesReport,
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
    return this.getQueryObjects().then(() => {
      this.getUserReports().then(() => {
        this.setState({isLoading: false});
      });
    })
  }

  initializeUser = () => {
    return ApiFetcher.get('user/me').then((resp) => {
      const newState = {
        isLoading: false,
      };
      if (resp.data) {
        newState.user = resp.data;
      }
        this.setState(newState);
        return resp;
    })
  }

  logUserIn = (googleIdToken) => {
    this.setState({isLoading: true});
    const payload = {'google_token': googleIdToken };
    ApiFetcher.post('session', payload).then((resp) => {
        const newState = {isLoading: false};
        if (resp.data) {
          newState.user = resp.data;
          this.hydrateUserData();
        } else if (resp.error === 'user-lookup'){
          const loginError = {
            text: "We couldn't find a Clarify user for that email. Are you sure you're using your Alpha email?",
          }
          newState.errors = {...this.state.errors, loginError};
        } else {
          const loginError = {
            text: "There was a problem at Google's end 🤔. Shoot an email over to help@clarify.com and we'll take a look.",
          }
          newState.errors = {
            ...this.state.errors,
            loginError,
          }
        }
        this.setState(newState);
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
        this.setState({students: resp.data});
      }
    }));
    promises.push(ApiFetcher.get('section').then((resp) => {
      if (resp.status !== 404) {
        this.setState({sections: resp.data});
      }
    }));
    promises.push(ApiFetcher.get('grade-level').then((resp) => {
      if (resp.status !== 404) {
        this.setState({gradeLevels: resp.data});
      }
    }));

    return Promise.all(promises);
  }

  getUserReports = () => {
    return ApiFetcher.get('report').then((reportsResponse) => {
      if (reportsResponse.data) {
        return this.fetchDataForReports(reportsResponse.data);
      }
    })
  }

  fetchDataForReports = (reports) => {
    const reportDataFetchPromises = [];
    _.forEach(reports, (report) => {
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
      const newReport = _.get(resp, 'data');
      if (newReport) {
        ReportFetcher.get(newReport.id).then((newReportData) => {
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
          errors: {...prevState.errors, ...{queryError: "You already have a saved report for that query"}},
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

  generateReportQuery = (parameters) => {
    if (!parameters) {
      return '';
    }

    // Reorder with care. See README for details.
    const PARAMETER_MAPPING = [
      {
        jsParameter: 'group',
        reportParameter: 'group',
      },
      {
        jsParameter: 'groupId',
        reportParameter: 'group_id',
      },
      {
        jsParameter: 'reportType',
        reportParameter: 'type',
      },
      {
        jsParameter: 'courseId',
        reportParameter: 'course_id',
      },
      {
        jsParameter: 'categoryId',
        reportParameter: 'category_id',
      },
      {
        jsParameter: 'assignmentId',
        reportParameter: 'assignment_id',
      },
    ];

    const queryString = _.reduce(PARAMETER_MAPPING, (result, mapping) => {
      const { jsParameter, reportParameter } = mapping;
      let parameterValue = _.get(parameters, jsParameter);
      if (!parameterValue) {
        return result;
      }

      return result += `${reportParameter}=${parameterValue}&`;
    }, '');

    return queryString.substring(0, queryString.length - 1);
  }

  summarizeAttendanceReport  = (report = null) => {
    if (!report) {
      return null;
    }
    const { data: reportData } = report;

    if (reportData.length === 1 ) {
      const attendanceComposite = _.reduce(reportData[0].attendance_data, (result, column) => {
        if (_.includes(IDS_FOR_ATTENDANCE_COMPOSITE, column.column_code)) {
          result += column.percentage;
        }
        return result;
      }, 0);
      return {
        singleRecordAttendanceComposite: _.round(attendanceComposite * 100, 2),
        singleRecordAttendanceCompositeLabel: ATTENDANCE_COMPOSITE_LABEL
      };
    }

    const shapedStudentRows = _.map(reportData, (node) => {
      const attendanceComposite = _.reduce(node.attendance_data, (result, column) => {
        if (_.includes(IDS_FOR_ATTENDANCE_COMPOSITE, column.column_code)) {
          result += column.percentage;
        }
        return result;
      }, 0);
      return {
        studentId: node.student_id,
        attendanceComposite: _.round(attendanceComposite * 100, 2),
      };
    });

    const minAttendanceNode = _.minBy(shapedStudentRows, 'attendanceComposite');
    const maxAttendanceNode = _.maxBy(shapedStudentRows, 'attendanceComposite');
    const minAttendanceStudent = _.find(this.state.students, {id: minAttendanceNode.studentId});
    const maxAttendanceStudent = _.find(this.state.students, {id: maxAttendanceNode.studentId});

    return {
      count: shapedStudentRows.length,
      mean: `${_.meanBy(shapedStudentRows, 'attendanceComposite')}%`,
      maxAttendanceStudent: `${maxAttendanceStudent.first_name} ${maxAttendanceStudent.last_name}`,
      highest: `${maxAttendanceNode.attendanceComposite}%`,
      minAttendanceStudent: `${minAttendanceStudent.first_name} ${minAttendanceStudent.last_name}`,
      lowest: `${minAttendanceNode.attendanceComposite}%`,
    };
  }

  summarizeGradesReport = (report = null) => {
    if (!report) {
      return null;
    }
    const { data: reportData } = report;

    const getPrimaryMeasureShapeForNode = (node) => {
      let primaryMeasureValue = null;
      if (node.measures.length === 1) {
        primaryMeasureValue = node.measures[0].measure;
      } else {
        primaryMeasureValue = _.find(node.measures, 'primary').measure;
      }
      return {
        label: node.label,
        primaryValue: primaryMeasureValue,
      };
    }
    if (reportData.length === 1) {
      return getPrimaryMeasureShapeForNode(reportData[0]);
    }
    const shapedMeasureList = _.map(reportData, getPrimaryMeasureShapeForNode);

    const minMeasureNode = _.minBy(shapedMeasureList, 'primaryValue');
    const maxMeasureNode = _.maxBy(shapedMeasureList, 'primaryValue');

    return {
      count: reportData.length,
      mean: `${_.round(_.meanBy(shapedMeasureList, 'primaryValue'), 2)}%`,
      maxMeasureNode: maxMeasureNode.label,
      highest: _.round(maxMeasureNode.primaryValue, 2),
      minMeasureNode: minMeasureNode.label,
      lowest: _.round(minMeasureNode.primaryValue, 2),
    };
  }

  getStaff = () => {
    return ApiFetcher.get('staff').then((resp) => {
        this.setState({staff: resp.data});
    });
  }

  shareReport = (query, target_staff) => {
    const reportPromises = [];
    // Line up report creation for each of the target staff memebrs
    _.forEach(target_staff, (s) => {
      reportPromises.push(ApiFetcher.post('report', {
        query,
        staff_id_for_report: s.value,
      }));
    })

    // Once all the reports are created for the target staff, create the share
    // relationship.
    const source_report = _.filter(this.state.reportDataList, {query});

    return Promise.all(reportPromises).then((reports) => {
      const sharePromises = []
      _.forEach(reports, (reportRequest) => {
        if (reportRequest.status === 201) {
          sharePromises.push(ApiFetcher.post('report-share', {
            parent_report_id: _.get(source_report, '[0].id'),
            child_report_id: reportRequest.data.id,
          }))
        }
      });

      if (source_report.length) {
        Promise.all(sharePromises).then(() => {
          source_report[0].shared_with = _.map(target_staff, 'label');
        });
      }
    })
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