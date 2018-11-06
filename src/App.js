import map from 'lodash/map';
import React from 'react';
import { Route } from 'react-router-dom';
import styled from 'styled-components';

import { DataConsumer } from './DataProvider';
import {
  Button,
  Error,
  Logo,
  Loading,
  PageHeading,
} from './components/PatternLibrary';
import {
  fontFamilies,
  layout
} from './components/PatternLibrary/constants';

import {
  LeftNavigation,
  LoginForm,
  Home,
  StudentDetail,
  Reminders,
} from './components';


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

const SiteNav = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  border-bottom: 1px solid lightgrey;
  height: ${layout.siteNavHeight};
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
      return (
        <Loading />
      );
    }

    if (!user) {
      return <LoginForm />;
    }

    return (
      <PageBody>
        <LeftNavigation />
        <MainContent>
          <Route path="/" component={PageHeading} />
          <Route path="/" exact component={Home} />
          <Route path="/student/:studentId" component={StudentDetail} />
          <Route path="/reminders/:studentId?" component={Reminders} />
        </MainContent>
      </PageBody>
    );
  }

  render() {
    const { user, errorMessages } = this.props;
    return (
      <Window>
        <SiteNav>
          <Logo alt="Clarify Logo" />
          <div style={{
              borderLeft: '2px solid lightgrey',
              paddingLeft: '25px',
            }}>
            {user &&
              <span style={{marginRight: '15px'}}>
                <i className="fas fa-user" style={{margin: '0 10px'}}/>
                User: {user.username}
              </span>
            }
            {user &&
              <Button
                onClick={this.props.logUserOut}>
                Logout
              </Button>
            }
          </div>
        </SiteNav>
        <Error>
          {map(errorMessages, (key, message) => {return <p>{message}</p>})}
        </Error>
        {this.getPageBody()}
      </Window>
    );
  }
}

export default props => (
  <DataConsumer>
    {({isLoading, user, errors, logUserOut}) => (
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
