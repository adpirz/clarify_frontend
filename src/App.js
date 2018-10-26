import map from 'lodash/map';
import React from 'react';
import { Route } from 'react-router-dom';
import styled from 'styled-components';

import { DataConsumer } from './DataProvider';
import {
  Button,
  Logo,
  Loading,
  Error,
} from './components/PatternLibrary';
import {
  layout
} from './components/PatternLibrary/constants';

import {
  LeftNavigation,
  LoginForm,
  Home,
} from './components';



const BodySection = styled.section`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
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
  top: calc(${layout.siteNavHeight} + 20px);
  left: ${layout.leftNavWidth};
`;

const StudentDetail = () => (<h1>StudentDetail</h1>);
const Reminders = () => (<h1>Reminders</h1>);

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
      <section>
        <LeftNavigation location="home" />
        <MainContent>
          <Route path="/" exact component={Home} />
          <Route path="/student/:id" component={StudentDetail} />
          <Route path="/reminders" component={Reminders} />
        </MainContent>
      </section>
    );
  }

  render() {
    const { user, errorMessages } = this.props;
    return (
      <BodySection>
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
      </BodySection>
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
