import _ from 'lodash';
import React from 'react';
import { DataConsumer } from './DataProvider';
import {
  Button,
  Logo,
  Loading,
  Error,
} from './components/PatternLibrary';
import {
  colors,
} from './components/PatternLibrary/constants';
import {
  LoginForm,
  ReportQueryBuilder,
  Worksheet
} from './components/index';

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
      <div style={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: '1',
          backgroundColor: colors.accent,
        }}>
        <ReportQueryBuilder />
        <div style={{
            margin: '20px 25px',
            padding: '25px',
            border: '1px solid lightgrey',
            backgroundColor: colors.white,
            borderRadius: '10px',
            flexGrow: '1',
          }}>
          <Worksheet />
        </div>
      </div>
    );
  }

  render() {
    const { user, errorMessages } = this.props;
    return (
      <div style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}>
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 20px',
            borderBottom: '1px solid lightgrey',
            minHeight: '46px',
          }}>
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
          {_.map(errorMessages, (key, message) => {return <p>{message}</p>})}
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
