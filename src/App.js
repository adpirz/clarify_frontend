import _ from 'lodash';
import React from 'react';
import { Dialog, FlatButton } from 'material-ui';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { PromiseState } from 'react-refetch';
import {
  LoginForm,
  ReportDetail,
  ReportQueryBuilder,
  Worksheet,
} from './components/index';
import './App.css'

class App extends React.Component {
  componentDidMount() {
    this.props.lazyUserGet();
  }

  componentWillReceiveProps = (nextProps) => {

    if (this.userIsAuthenticated(nextProps) && !this.queryRequestsMade(nextProps)) {
      // User is signed in, so let's make our object api calls.
      this.props.lazyUserGet();
      this.requestQueryObjects();
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
    } = this.props;

    lazyStudentGet();
    lazySectionGet();
    lazyGradeLevelGet();
    lazySiteGet();
  }

  queryRequestsMade = (props) => {
    const { siteGet, gradeLevelGet, sectionGet, studentGet } = props;
    return !!(siteGet && gradeLevelGet && sectionGet && studentGet);
  }

  queryRequestsFulfilled = (props) => {
    const { siteGet, gradeLevelGet, sectionGet, studentGet } = props;
    const allRequests = PromiseState.all([siteGet, gradeLevelGet, sectionGet, studentGet]);
    return allRequests.fulfilled
  }

  submitQueryFulfilled = () => {
    if (this.props.postReportQuery) {
      const { postReportQuery } = this.props;
      const postRequestResponse = PromiseState.resolve(postReportQuery);
      if (postRequestResponse.fulfilled) {
        return postRequestResponse.value.data;
      }
    }
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
      userData: _.get(userGet, 'value', []),
    };

    return promiseValues;
  }

  logout = () => {
    this.props.lazyUserLogout();
    window.location.reload();
  }

  render() {
    const promiseValues = this.getPromiseValues();
    const queryResponseValues = this.submitQueryFulfilled();

    if (!this.userIsAuthenticated(this.props)) {
      return <LoginForm lazySessionPost={this.props.lazySessionPost} />;
    }

    if (!promiseValues) {
      return null;
    }

    const { username } = promiseValues.userData;
    return (
      <div>
        <div className="navbar">
          <img
            src="./logo.png"
            alt="Clarify Logo"
            className="logo"
          />
          <div
            className="logoutSection inline-block"
          >
            <div>
              <i className="material-icons">person</i>
              <div className="username inline-block">
                {username}
              </div>
            </div>
            <div
              className="logoutBtn"
            >
              <FlatButton
                onClick={() => this.logout()}
                className="logoutBtn"
                label="logout"
                labelStyle={{
                  fontSize: '13px',
                  textTransform: 'uppercase',
                }}
              />
            </div>
          </div>
          <img
            src="./logo.png"
            alt="Clarify Logo"
            className="logo"
          />
        </div>
        <hr />
        <ReportQueryBuilder
          {...promiseValues}
          submitReportQuery={this.props.submitReportQuery}
        />
        <BrowserRouter>
          <Switch>
            <Route
              render={(renderProps) => {
                return (
                  <Worksheet
                    {...this.props}
                    userData={promiseValues.userData}
                    students={promiseValues.students}
                    queryResponseValues={queryResponseValues}
                  />
                )
              }}
              key="WorksheetRoute"
            />
            <Route
              path={`/report/:reportId`}
              component={ReportDetail}
              exact
              key="ReportDetailRoute"
            />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
