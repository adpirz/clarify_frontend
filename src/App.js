import React from "react";
import queryString from "query-string";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import get from "lodash/get";
import { Container, Grid } from "semantic-ui-react";
import { ToastContainer } from "react-toastify";

import { DataConsumer } from "./DataProvider";
import { Loading } from "./components/PatternLibrary";

import {
  LeftNavigation,
  LoginForm,
  PasswordResetForm,
  RegisterForm,
  Home,
  StudentDetail,
  Reminders,
} from "./components";
import posed, { PoseGroup } from "react-pose";

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
        user_id: nextProps.user.id,
      });
    }
  };

  getOAuthCode = () => {
    const { search } = this.props.location;
    const queryParams = queryString.parse(search);
    return queryParams.code || undefined;
  };

  getPageBody = () => {
    const { isLoading, cleverLoading, user, startCleverOAuth, history, location } = this.props;

    // Loader
    if (isLoading || cleverLoading) {
      return <Loading />;
    }
    const code = this.getOAuthCode();
    if (code && !user) {
      startCleverOAuth(code).then(() => history.push("/"));
    }

    // Needs to Login
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

    const RouteContainer = posed.div({
      enter: { opacity: 1, delay: 300, beforeChildren: true },
      exit: { opacity: 0 },
    });

    const locationKey = location.path
      ? location.path
          .split("/")
          .slice(0, 2)
          .join("-")
      : "start";
    // Home page
    return (
      <Grid style={{ marginTop: "1em" }}>
        <Grid.Row>
          <Grid.Column width={4}>
            <LeftNavigation />
          </Grid.Column>
          <PoseGroup>
            <Grid.Column as={RouteContainer} key={locationKey || "start"} width={12}>
              <Switch key={locationKey}>
                <Route path="/" exact component={Home} />
                <Route path="/student/:studentID" component={StudentDetail} />
                <Route path="/reminders" component={Reminders} />
                <Redirect to="/" />
              </Switch>
            </Grid.Column>
          </PoseGroup>
        </Grid.Row>
      </Grid>
    );
  };

  render = () => {
    return (
      <Container fluid>
        <ToastContainer />
        {this.getPageBody()}
      </Container>
    );
  };
}

export default withRouter(props => (
  <DataConsumer>
    {({ isLoading, cleverLoading, user, errors, messages, startCleverOAuth }) => (
      <App
        user={user}
        isLoading={isLoading}
        cleverLoading={cleverLoading}
        errors={errors}
        messages={messages}
        startCleverOAuth={startCleverOAuth}
        {...props}
      />
    )}
  </DataConsumer>
));
