import map from 'lodash/map';
import React from 'react';
import { Route } from 'react-router-dom'

import { DataConsumer } from './DataProvider';
import {
  Button,
  Logo,
  Loading,
  Error,
  LeftNavigation,
} from './components/PatternLibrary';
import {
  layout
} from './components/PatternLibrary/constants';

import {
  LoginForm,
} from './components/index';



const styles = {
  body: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  siteNav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    borderBottom: '1px solid lightgrey',
    height: layout.siteNavHeight,
  },
  mainContent: {
    position: 'absolute',
    top: `calc(${layout.siteNavHeight} + 20px)`,
    left: layout.leftNavWidth,
  },
}

const Home = () => (<h1>HOME</h1>);
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
        <div style={styles.mainContent}>
          <Route path="/" exact component={Home} />
          <Route path="/student/:id" component={StudentDetail} />
          <Route path="/reminders" component={Reminders} />
        </div>
      </section>
    );
  }

  render() {
    const { user, errorMessages } = this.props;
    return (
      <div style={styles.body}>
        <div style={styles.siteNav}>
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
        </div>
        <Error>
          {map(errorMessages, (key, message) => {return <p>{message}</p>})}
        </Error>
        {this.getPageBody()}
      </div>
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
