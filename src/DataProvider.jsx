import React from "react";
import filter from "lodash/filter";
import format from "date-fns/format";

import { ApiFetcher } from "./fetchModule";

const Context = React.createContext();

export class DataProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      isLoading: false,
      cleverLoading: false,
      errors: {
        queryError: null,
        loginError: null,
      },
      students: null,
      actions: null,
      sections: null,
      deltas: null,
      initializeUser: this.initializeUser,
      logUserIn: this.logUserIn,
      logUserOut: this.logUserOut,
      saveAction: this.saveAction,
      deleteAction: this.deleteAction,
      getReminderActions: this.getReminderActions,
      startCleverOAuth: this.startCleverOAuth,
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    this.initializeUser().then(resp => {
      if (resp.status !== 404) {
        this.hydrateUserData();
      } else {
        return;
      }
    });
  }

  hydrateUserData = () => {
    this.setState({ isLoading: true });
    return this.getQueryObjects().then(() => {
      this.setState({
        isLoading: false,
      });
    });
  };

  initializeUser = () => {
    return ApiFetcher.get("user/me").then(resp => {
      const newState = {
        isLoading: false,
      };
      if (resp.data) {
        newState.user = resp.data;
      }
      this.setState(newState);
      return resp;
    });
  };

  startCleverOAuth = code => {
    if (this.state.cleverLoading) {
      this.setState({ isLoading: true });
      return Promise.resolve();
    }
    this.setState({ cleverLoading: true });
    return ApiFetcher.post("clever", { code }).then(resp => {
      return this.initializeUser().then(resp => {
        this.setState({ isLoading: true });
        if (resp.status !== 404) {
          return this.hydrateUserData().then(() => {
            this.setState({ cleverLoading: false });
          });
        } else {
          return Promise.resolve();
        }
      });
    });
  };

  logUserIn = (username, password, googleIdToken = null) => {
    this.setState({ isLoading: true });
    let payload = {};
    if (googleIdToken) {
      payload.google_token = googleIdToken;
    } else {
      payload.username = username;
      payload.password = password;
    }
    ApiFetcher.post("session", payload).then(resp => {
      const newState = {};
      if (resp.data) {
        newState.user = resp.data;
        this.hydrateUserData();
      } else if (resp.error === "user-lookup") {
        const loginError = {
          text:
            "We couldn't find a Clarify user for that email. Are you sure you're using your Alpha email?",
        };
        newState.errors = { ...this.state.errors, loginError };
        newState.isLoading = false;
      } else {
        const loginError = {
          text:
            "There was a problem at Google's end 🤔. Shoot an email over to help@clarify.com and we'll take a look.",
        };
        newState.errors = {
          ...this.state.errors,
          loginError,
          isLoading: false,
        };
      }
      this.setState(newState);
    });
  };

  logUserOut = () => {
    ApiFetcher.delete("session").then(() => {
      window.location.reload();
    });
  };

  getQueryObjects = () => {
    const promises = [];
    promises.push(
      ApiFetcher.get("action").then(resp => {
        if (resp.status !== 404) {
          this.setState({ actions: resp.data });
        }
      })
    );
    promises.push(
      ApiFetcher.get("delta").then(resp => {
        if (resp.status !== 404) {
          this.setState({ deltas: resp.data });
        }
      })
    );
    promises.push(
      ApiFetcher.get("student").then(resp => {
        if (resp.status !== 404) {
          this.setState({ students: resp.data });
        }
      })
    );
    promises.push(
      ApiFetcher.get("section").then(resp => {
        if (resp.status !== 404) {
          this.setState({ sections: resp.data });
        }
      })
    );

    return Promise.all(promises);
  };

  saveAction = payload => {
    const { type, note, dueOn, completed, studentId, actionId, deltaIDs, audience } = payload;
    if (!dueOn && !completed) {
      return;
    }
    const actionPayload = {
      action_id: actionId,
      type,
      note,
      student_id: studentId,
      public: audience === "public",
      delta_ids: deltaIDs,
      due_on: dueOn ? format(dueOn, "MM/DD/YYYY HH:mm") : null,
      completed_on: completed ? format(new Date(), "MM/DD/YYYY HH:mm") : null,
    };
    let actionPromise = null;
    if (!actionId) {
      actionPromise = ApiFetcher.post("action", actionPayload);
    } else {
      actionPromise = ApiFetcher.put("action", actionPayload);
    }
    return actionPromise.then(resp => {
      if (resp.status === 200 || resp.status === 201) {
        ApiFetcher.get("action").then(resp => {
          if (resp.status !== 404) {
            this.setState({ actions: resp.data });
          }
        });
      }
      return resp;
    });
  };

  deleteAction = actionId => {
    return ApiFetcher.delete(`action/${actionId}`).then(resp => {
      if (resp.status === 204) {
        ApiFetcher.get("action").then(resp => {
          if (resp.status !== 404) {
            this.setState({ actions: resp.data });
          }
        });
        return resp;
      }
    });
  };

  getReminderActions = () => {
    return filter(this.state.actions, a => {
      return !a.completed_on && !!a.due_on;
    });
  };

  render() {
    const { children } = this.props;
    return <Context.Provider value={this.state}>{children}</Context.Provider>;
  }
}

export const DataConsumer = Context.Consumer;
