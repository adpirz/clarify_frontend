import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Route } from 'react-router-dom';
import Dashboard from './routes/Dashboard/components/Dashboard/Dashboard';
import ReportDetail from './routes/ReportDetail/components/ReportDetail/ReportDetail';


class App extends React.Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <div>
            <Route
              path={`/dashboard`}
              render={() => (
                <Dashboard {...this.props} />
              )}
              exact
              key="DashboardRoute"
              props={this.props}
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
