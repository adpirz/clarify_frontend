import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Route } from 'react-router-dom';
import Worksheet from './routes/Worksheet/Worksheet';
import ReportDetail from './routes/ReportDetail/components/ReportDetail/ReportDetail';


class App extends React.Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <div>
            <Route
              path={`/`}
              render={() => (
                <Worksheet {...this.props} />
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
