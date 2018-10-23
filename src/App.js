import map from 'lodash/map';
import React from 'react';
import { DataConsumer } from './DataProvider';
import {
  Button,
  Logo,
  Loading,
  Error,
  LeftNavigation,
} from './components/PatternLibrary';
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
    minHeight: '2.5vh',
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: '1',
  },
}

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
      <div style={styles.mainContent}>
        <LeftNavigation location="home" />
      </div>
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
