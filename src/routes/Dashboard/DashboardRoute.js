import React from 'react';
import { Route } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';

const DashboardRoute = (
  <Route
    path={`/dashboard`}
    component={Dashboard}
    exact
    props={this.props}
    key="DashboardRoute" />
);

export default DashboardRoute;
