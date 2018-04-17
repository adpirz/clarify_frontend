import _ from 'lodash';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { PromiseState } from 'react-refetch';
import {
  ReportDetail,
  Worksheet,
  SearchBar,
  LoginForm,
} from './components';

class App extends React.Component {
  componentDidMount() {
    this.props.lazySessionGet();
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
    const allRequestse = PromiseState.all([ schoolGet, gradeLevelGet, sectionGet, studentGet ]);
    return !allRequestse.fulfilled
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
    return <LoginForm lazySessionPost={this.props.lazySessionPost}/>;

    return (
      <div>
        <BrowserRouter>
          <SearchBar />
          <Switch>
            <Route
              component={Worksheet}
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
