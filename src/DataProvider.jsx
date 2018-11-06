import React from 'react';
import { ApiFetcher } from './fetchModule';
import filter from 'lodash/filter';

const Context = React.createContext();

export class DataProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      isLoading: false,
      errors: {
        queryError: null,
        loginError: null,
      },
      students: null,
      actions: null,
      sections: null,
      staff: [],
      initializeUser: this.initializeUser,
      logUserIn: this.logUserIn,
      logUserOut: this.logUserOut,
      getStaff: this.getStaff,
      createAction: this.createAction,
      getReminders: this.getReminders,
    };
  }

  componentDidMount() {
    this.setState({isLoading: true});
    this.initializeUser()
    .then((resp) => {
      if (resp.status !== 404) {
        this.hydrateUserData();
      } else {
        return;
      }
    })
  }

  hydrateUserData = () => {
    this.setState({isLoading: true});
    return this.getQueryObjects().then(() => {
      this.setState({
        isLoading: false,
      });
    })
  }

  initializeUser = () => {
    return ApiFetcher.get('user/me').then((resp) => {
      const newState = {
        isLoading: false,
      }
      if (resp.data) {
        newState.user = resp.data;
      }
      this.setState(newState);
      return resp;
    })
  }

  logUserIn = (googleIdToken) => {
    this.setState({isLoading: true});
    const payload = {'google_token': googleIdToken };
    ApiFetcher.post('session', payload).then((resp) => {
        const newState = {};
        if (resp.data) {
          newState.user = resp.data;
          this.hydrateUserData();
        } else if (resp.error === 'user-lookup'){
          const loginError = {
            text: "We couldn't find a Clarify user for that email. Are you sure you're using your Alpha email?",
          }
          newState.errors = {...this.state.errors, loginError};
          newState.isLoading = false;
        } else {
          const loginError = {
            text: "There was a problem at Google's end 🤔. Shoot an email over to help@clarify.com and we'll take a look.",
          }
          newState.errors = {
            ...this.state.errors,
            loginError,
            isLoading: false,
          }
        }
        this.setState(newState);
    });
  }

  logUserOut = () => {
    ApiFetcher.delete('session').then(() => {
      window.location.reload();
    });
  }

  getQueryObjects = () => {
    const promises = [];
    promises.push(ApiFetcher.get('action').then((resp) => {
      if (resp.status !== 404) {
        this.setState({actions: resp.data});
      }
    }));
    promises.push(ApiFetcher.get('student').then((resp) => {
      if (resp.status !== 404) {
        this.setState({students: resp.data});
      }
    }));
    promises.push(ApiFetcher.get('section').then((resp) => {
      if (resp.status !== 404) {
        this.setState({sections: resp.data});
      }
    }));

    return Promise.all(promises);
  }

  getStaff = () => {
    return ApiFetcher.get('staff').then((resp) => {
        this.setState({staff: resp.data});
    });
  }

  createAction = ({type, note, studentId, dueOn, completedOn}) => {
    const payload = {
      type,
      note,
      student_id: studentId,
      private: true,
      due_on: dueOn,
      completed_on: completedOn,
    }
    return ApiFetcher.post('action', payload).then((resp) => {
      if (resp.status === 201) {
        ApiFetcher.get('action').then((resp) => {
          if (resp.status !== 404) {
            this.setState({actions: resp.data});
          }
        })
        return resp;
      }
    });
  }

  getReminders = () => {
    console.debug(this.state);
    return filter(this.state.actions, (a) => {
      return a.date_completed;
    });
  }

  render() {
    const {children} = this.props;

    return (
      <Context.Provider value={this.state}>
        {children}
      </Context.Provider>
    )
  }
}

export const DataConsumer = Context.Consumer;