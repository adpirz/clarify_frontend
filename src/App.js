import map from "lodash/map";
import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import styled from "styled-components";
import posed, { PoseGroup } from "react-pose";
import get from "lodash/get";

import { DataConsumer } from "./DataProvider";
import { Error, Message, Loading, SiteNav, NotFound } from "./components/PatternLibrary";
import { fontFamilies, layout } from "./components/PatternLibrary/constants";

import { LeftNavigation, LoginForm, Home, StudentDetail, Reminders } from "./components";

const Window = styled.section`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const PageBody = styled.section`
  position: absolute;
  top: calc(${layout.siteNavHeight} + 20px);
  left: 0;
  bottom: 0;
  right: 0;
  font-family: ${fontFamilies.base};
`;

const MainContent = styled.section`
  position: absolute;
  width: calc(100% - ${layout.leftNavWidth});
  left: ${layout.leftNavWidth};
  top: 0;
  bottom: 0;
  overflow: scroll;
`;

const RouteContainer = posed.div();

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
    const search = this.props.location.search;
    const code = search.match(/code=([\d\w]+)&/);
    return code ? code[1] : undefined;
  };

  getPageBody = () => {
    const { isLoading, user, startCleverOAuth } = this.props;
    if (isLoading) {
      return <Loading />;
    }

    const code = this.getOAuthCode();

    if (code && !user) {
      startCleverOAuth(code).then(() => this.props.history.push("/"));
    }

    if (!user) {
      return (
        <Switch>
          <Route
            path="/password-reset/"
            render={props => <LoginForm isPasswordReset {...props} />}
          />
          <Route component={LoginForm} />
        </Switch>
      );
    }

    return (
      <Switch>
        <Route path="/password-reset/" render={props => <LoginForm isPasswordReset {...props} />} />
        <Route
          render={({ location }) => (
            <PageBody>
              <LeftNavigation />
              <MainContent>
                <PoseGroup animateOnMount>
                  <RouteContainer key={location.key || "start"}>
                    <Switch location={location}>
                      <Route path="/" exact component={Home} />
                      <Route path="/student/:studentId" component={StudentDetail} />
                      <Route path="/reminders/:studentId?" component={Reminders} />
                      <Route component={NotFound} />
                    </Switch>
                  </RouteContainer>
                </PoseGroup>
              </MainContent>
            </PageBody>
          )}
        />
      </Switch>
    );
  };

  render() {
    const { user, errorMessages, messages, logUserOut } = this.props;
    return (
      <Window>
        <SiteNav user={user} logUserOut={logUserOut} />
        <Error>
          {map(errorMessages, (key, message) => {
            return <p key={key}>{message}</p>;
          })}
        </Error>
        <PoseGroup animateOnMount={true}>
          {map(messages, (message, key) => {
            return <Message key={key}>{message}</Message>;
          })}
        </PoseGroup>
        {this.getPageBody()}
      </Window>
    );
  }
}

export default withRouter(props => (
  <DataConsumer>
    {({ isLoading, user, errors, logUserOut, startCleverOAuth, messages }) => (
      <App
        user={user}
        logUserOut={logUserOut}
        isLoading={isLoading}
        errors={errors}
        startCleverOAuth={startCleverOAuth}
        messages={messages}
        {...props}
      />
    )}
  </DataConsumer>
));
