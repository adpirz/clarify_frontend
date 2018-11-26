import React from "react";
import { ApiFetcher } from "./fetchModule";
import filter from "lodash/filter";
import format from "date-fns/format";

import clever from "./CleverAuth";

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
      deltas: null,
      initializeUser: this.initializeUser,
      logUserIn: this.logUserIn,
      logUserOut: this.logUserOut,
      getStaff: this.getStaff,
      saveAction: this.saveAction,
      deleteAction: this.deleteAction,
      getReminderActions: this.getReminderActions,
      clever: this.clever,
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

  clever = code => {
    const { id, token } = clever.runOAuthFlow(code);
    clever.getMySectionsWithStudents(id, token).then(d => console.log(d));
  };

  logUserIn = googleIdToken => {
    this.setState({ isLoading: true });
    const payload = { google_token: googleIdToken };
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

  getStaff = () => {
    return ApiFetcher.get("staff").then(resp => {
      this.setState({ staff: resp.data });
    });
  };

  saveAction = payload => {
    const { type, note, dueOn, completed, studentId, actionId, deltaIDs } = payload;
    if (!dueOn && !completed) {
      return;
    }
    const actionPayload = {
      action_id: actionId,
      type,
      note,
      student_id: studentId,
      private: true,
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
