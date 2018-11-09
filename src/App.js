import map from "lodash/map";
import React from "react";
import { Route } from "react-router-dom";
import styled from "styled-components";

import { DataConsumer } from "./DataProvider";
import { Error, Loading, SiteNav } from "./components/PatternLibrary";
import { fontFamilies, layout } from "./components/PatternLibrary/constants";

import {
  LeftNavigation,
  LoginForm,
  Home,
  StudentDetail,
  Reminders
} from "./components";

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

class App extends React.Component {
  getPageBody = () => {
    const { isLoading, user } = this.props;
    if (isLoading) {
      return <Loading />;
    }

    if (!user) {
      return <LoginForm />;
    }

    return (
      <PageBody>
        <LeftNavigation />
        <MainContent>
          <Route path="/" exact component={Home} />
          <Route path="/student/:studentId" component={StudentDetail} />
          <Route path="/reminders/:studentId?" component={Reminders} />
        </MainContent>
      </PageBody>
    );
  };

  render() {
    const { user, errorMessages, logUserOut } = this.props;
    return (
      <Window>
        <SiteNav user={user} logUserOut={logUserOut} />
        <Error>
          {map(errorMessages, (key, message) => {
            return <p>{message}</p>;
          })}
        </Error>
        {this.getPageBody()}
      </Window>
    );
  }
}

export default props => (
  <DataConsumer>
    {({ isLoading, user, errors, logUserOut }) => (
      <App
        user={user}
        logUserOut={logUserOut}
        isLoading={isLoading}
        errors={errors}
        {...props}
      />
    )}
  </DataConsumer>
);
