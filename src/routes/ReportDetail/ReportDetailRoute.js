import React from 'react';
import { Route } from 'react-router-dom';
import ReportDetail from './components/ReportDetail/ReportDetail';

const ReportDetailRoute = (
  <Route
    path={`/report/:reportId`}
    component={ReportDetail}
    exact/>
);

export default ReportDetailRoute;
