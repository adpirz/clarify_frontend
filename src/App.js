import _ from 'lodash';
import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { PromiseState } from 'react-refetch';
import Worksheet from './routes/Worksheet/Worksheet';
import ReportDetail from './routes/ReportDetail/components/ReportDetail/ReportDetail';


class App extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (this.userIsLoggedIn(nextProps)) {

    }
  }

  userIsLoggedIn = (props) => {
    const { sessionGet } = props;
    if (!sessionGet || !sessionGet.fulfilled) {
      return false;
    }
    return sessionGet.status in ['200', '201'];
  }

  requestsHaveBeenMade = (props) => {
    const { schoolGet, gradeLevelGet, sectionGet, studentGet } = props;
    return schoolGet && gradeLevelGet && sectionGet && studentGet)
  }

  requestsHaveBeenFulfilled = (props) => {
    const { schoolGet, gradeLevelGet, sectionGet, studentGet } = props;
    const allRequestse = PromiseState.all([ schoolGet, gradeLevelGet, sectionGet, studentGet ]);
    return !allRequestse.fulfilled
  }

  getPromiseValues = () => {
    if (!this.requestsHaveBeenMade(this.props) || !requestsHaveBeenFulfilled(this.props) {
      return null;
    }
    const { studentGet, gradeLevelGet, sectionGet, schoolGet } = props;

    const promiseValues = {
      students: _.get(studentGet, 'value.data', []),
      gradeLevels: _.get(gradeLevelGet, 'value.data', []),
      sections: _.get(studentGet, 'value.data', []),
      schools: _.get(schoolGet, 'value.data', []),
    };

    return promiseValues;
  }

  render() {
    if (!this.getPromiseValues()) {
      return null;
    }

    return (
      <div>
        <BrowserRouter>
          <div>
            <Route
              path={`/`}
              render={(routerProps) => (
                <Worksheet {...this.props} {...routerProps} />
              )}
              key="WorksheetRoute"
            />
            <Route
              path={`/report/:reportId`}
              component={ReportDetail}
              exact
              key="ReportDetailRoute"
            />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
