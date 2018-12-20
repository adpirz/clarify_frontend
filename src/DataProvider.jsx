import React from "react";
import filter from "lodash/filter";
import orderBy from "lodash/orderBy";
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
      resetToken: null,
      errors: {
        queryError: null,
        loginError: null,
      },
      messages: [],
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
      postPasswordReset: this.postPasswordReset,
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    this.initializeUser().then(resp => {
      if (resp.status !== 404) {
        this.hydrateUserData();
      } else {
        this.setState({ isLoading: false });
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
    } else if (username && password) {
      payload.username = username;
      payload.password = password;
    } else {
      return;
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
      } else if (resp.error === "invalid-credentials") {
        const loginError = {
          text: "Those look like invalid credentials.",
        };
        newState.errors = {
          ...this.state.errors,
          loginError,
        };
        newState.isLoading = false;
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
    const { type, note, dueOn, completed, studentID, actionID, deltaIDs, audience } = payload;
    if (!dueOn && !completed) {
      return;
    }
    const actionPayload = {
      action_id: actionID,
      type,
      note,
      student_id: studentID,
      public: audience === "public",
      delta_ids: deltaIDs,
    };
    if (dueOn) {
      actionPayload.due_on = format(dueOn, "MM/DD/YYYY HH:mm");
    }
    if (completed === true) {
      actionPayload.completed_on = format(new Date(), "MM/DD/YYYY HH:mm");
    } else if (completed === false) {
      actionPayload.completed_on = null;
    }
    let actionPromise = null;
    if (!actionID) {
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

  deleteAction = actionID => {
    return ApiFetcher.delete(`action/${actionID}`).then(resp => {
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
    const a = orderBy(
      filter(this.state.actions, a => {
        return !a.completed_on && !!a.due_on;
      }),
      ["due_on"],
      ["asc"]
    );
    return a;
  };

  postPasswordReset = ({ email, new_password, reset_token }) => {
    const endpoint = "user/password-reset";
    if (email) {
      return ApiFetcher.post(endpoint, { email }).then(resp => {
        if (resp.ok) {
          return this.setState(({ messages }) => ({
            messages: [...messages, ["EMAIL SENT"]],
          }));
        } else {
          return this.setState(({ errors }) => ({
            errors: { resetError: "Error sending email.", ...errors },
          }));
        }
      });
    }
    return ApiFetcher.post(endpoint, { new_password, reset_token }).then(resp => {
      if (resp.ok) {
        return this.setState(({ messages }) => ({
          messages: [].concat(messages, ["Password successfully reset."]),
        }));
      } else {
        return this.setState(({ errors }) => ({
          errors: [].concat(errors, ["Error resetting password."]),
        }));
      }
    });
  };

  render() {
    const { children } = this.props;
    return <Context.Provider value={this.state}>{children}</Context.Provider>;
  }
}

export const DataConsumer = Context.Consumer;
