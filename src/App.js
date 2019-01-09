import React from "react";
import queryString from "query-string";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import get from "lodash/get";
import { Container, Grid, Segment, Loader } from "semantic-ui-react";

import { DataConsumer } from "./DataProvider";
import { Error, Message, Loading, SiteNav } from "./components/PatternLibrary";
import { fontFamilies, layout } from "./components/PatternLibrary/constants";

import {
  LeftNavigation,
  LoginForm,
  PasswordResetForm,
  RegisterForm,
  Home,
  StudentDetail,
  Reminders,
} from "./components";

import { SiteNav } from "./components/PatternLibrary";
<<<<<<< HEAD
=======
import { LeftNavigation, Home, StudentDetail } from "./components";
>>>>>>> added StudentDetail route

class App extends React.Component {
  componentDidMount = () => {
    window.Intercom("boot", {
      app_id: "imkydqhm",
    });
  };

  componentWillReceiveProps = nextProps => {
    if (this.props.location.pathname !== nextProps.location.pathname) {
      window.Intercom("update");
    }

    const oldUserId = get(this.props, "user.id");
    const newUserId = get(nextProps, "user.id");
    if (newUserId && oldUserId !== newUserId) {
      window.Intercom("boot", {
        app_id: "imkydqhm",
        name: `${nextProps.user.first_name} ${nextProps.user.last_name}`,
        email: nextProps.user.username,
        id: nextProps.user.id,
      });
    }
  };

  getOAuthCode = () => {
    const { search } = this.props.location;
    const queryParams = queryString.parse(search);
    return queryParams.code || undefined;
  };

  getPageBody = () => {
    const { isLoading, user, startCleverOAuth, history } = this.props;
    if (isLoading) {
      return <Loading />;
    }
    const code = this.getOAuthCode();
    if (code && !user) {
      startCleverOAuth(code).then(() => history.push("/"));
    }
    isPasswordReset = () => {
      if (!this.props.location) return false;
      return this.props.location.pathname === "/password-reset/";
    };

    getResetToken = () => {
      const token = this.props.locaton.search.match(/token=([\d\w]+)/);
      return token ? token[1] : undefined;
    };

    render = () => {
      const { user, logUserOut, isLoading } = this.props;
      if (!user) {
        return (
          <Switch>
            <Route path="/password-reset" component={PasswordResetForm} />
            <Route path="/register" component={RegisterForm} />
            <Route path="/login" component={LoginForm} />
            <Redirect to="/login" />
          </Switch>
        );
      }

      if (isLoading) {
        return (
          <div style={{ paddingTop: "50px" }}>
            <Container>
              <Segment placeholder size="massive">
                <Loader active>Loading</Loader>
              </Segment>
            </Container>
          </div>
        );
      }

      return (
        <Container fluid>
          <SiteNav user={user} logUserOut={logUserOut} />
          <Grid>
            <Grid.Row>
              <Grid.Column width={4}>
                <LeftNavigation />
              </Grid.Column>
              <Grid.Column width={12}>
                <Switch>
                  <Route path="/" exact component={Home} />
                  <Route path="/student/:studentID" component={StudentDetail} />
                  <Route path="/reminders" component={Reminders} />
                  <Redirect to="/" />
                </Switch>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      );
<<<<<<< HEAD
    };
=======

    return (
      <Container fluid>
        <SiteNav user={user} logUserOut={logUserOut} />
        <Grid>
          <Grid.Row>
            <Grid.Column width={4}>
              <LeftNavigation />
            </Grid.Column>
            <Grid.Column width={12}>
              <Switch>
                <Route path="/" exact component={Home} />
                <Route component={StudentDetail} />
              </Switch>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
>>>>>>> added StudentDetail route
  };
}

export default withRouter(props => (
  <DataConsumer>
    {({ isLoading, user, errors, logUserOut, messages, startCleverOAuth }) => (
      <App
        user={user}
        logUserOut={logUserOut}
        isLoading={isLoading}
        errors={errors}
        messages={messages}
        startCleverOAuth={startCleverOAuth}
        {...props}
      />
    )}
  </DataConsumer>
));
