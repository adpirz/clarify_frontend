import _ from 'lodash';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { PromiseState } from 'react-refetch';
import {
  LoginForm,
  ReportDetail,
  ReportQueryBuilder,
  Worksheet,
} from './components/index';
import './App.css';

class App extends React.Component {
  componentDidMount() {
    this.props.lazyUserGet();
  }

  componentWillReceiveProps = (nextProps) => {

    if (this.userIsAuthenticated(nextProps) && !this.queryRequestsMade(nextProps)) {
      // User is signed in, so let's make our object api calls.
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
      lazySchoolGet,
    } = this.props;

    lazyStudentGet();
    lazySectionGet();
    lazyGradeLevelGet();
    lazySchoolGet();
  }

  queryRequestsMade = (props) => {
    const { schoolGet, gradeLevelGet, sectionGet, studentGet } = props;
    return schoolGet && gradeLevelGet && sectionGet && studentGet;
  }

  queryRequestsFulfilled = (props) => {
    const { schoolGet, gradeLevelGet, sectionGet, studentGet } = props;
    const allRequests = PromiseState.all([ schoolGet, gradeLevelGet, sectionGet, studentGet ]);
    return allRequests.fulfilled
  }

  getPromiseValues = () => {
    if (!this.queryRequestsMade(this.props) || !this.queryRequestsFulfilled(this.props)) {
      return null;
    }
    const {
      studentGet,
      gradeLevelGet,
      sectionGet,
      schoolGet,
    } = this.props;

    const promiseValues = {
      students: _.get(studentGet, 'value.data', []),
      gradeLevels: _.get(gradeLevelGet, 'value.data', []),
      sections: _.get(sectionGet, 'value.data', []),
      schools: _.get(schoolGet, 'value.data', []),
    };

    return promiseValues;
  }

  render() {
    const promiseValues = this.getPromiseValues();

    if (!this.userIsAuthenticated(this.props)) {
      return <LoginForm lazySessionPost={this.props.lazySessionPost}/>;
    }

    if (!promiseValues) {
      return null;
    }

    return (
      <div>
        <div className="navbar" />
        <hr />
        <ReportQueryBuilder
          {...promiseValues}
          submitReportQuery={this.props.submitReportQuery}
        />
        <BrowserRouter>
          <Switch>
            <Route
              render={(renderProps) => {
                return <Worksheet {...this.props} />
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
