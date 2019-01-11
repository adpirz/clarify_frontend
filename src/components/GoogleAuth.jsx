import React from "react";
import PropTypes from "prop-types";

import { ThirdPartyLoginButton, GoogleLogo } from "./PatternLibrary";
import { DataConsumer } from "../DataProvider";

class GoogleAuth extends React.Component {
  propTypes: {
    onSuccess: PropTypes.func.isRequired,
    onFailure: PropTypes.func,
  };

  componentDidMount() {
    try {
      window.gapi.load("client:auth2", () => {
        if (!window.gapi.auth2.getAuthInstance()) {
          window.gapi.auth2.init({ client_id: this.props.GAPI_CLIENT_ID });
        }
      });
    } catch (e) {
      this.props.setLoginError(
        "Unable to load the Google authentication service. Check your internet connection?"
      );
    }
  }

  authorizeGoogleRegistration = () => {
    return window.gapi.auth2
      .getAuthInstance()
      .signIn()
      .then(
        googleUser => {
          // Might seem weird to have the emails scope here, but it means the returned token
          // will support the BE lookup of the teacher's email.
          const SCOPES =
            "https://www.googleapis.com/auth/classroom.courses.readonly " +
            "https://www.googleapis.com/auth/classroom.rosters.readonly " +
            "https://www.googleapis.com/auth/classroom.profile.emails";
          return googleUser.grant({ scope: SCOPES }).then(
            googleUser => {
              const {
                access_token: authorizationToken,
                id_token: idToken,
              } = googleUser.getAuthResponse();
              this.props.onSuccess(authorizationToken, idToken);
            },
            function(error) {
              console.error("Error signing in", error);
            }
          );
        },
        error => {
          console.error("Error signing in", error);
        }
      );
  };

  logInWithGoogle = () => {
    return window.gapi.auth2
      .getAuthInstance()
      .signIn()
      .then(
        googleUser => {
          const { id_token: accessToken } = googleUser.getAuthResponse();
          this.props.onSuccess(accessToken);
          console.log("Sign-in successful");
        },
        error => {
          console.error("Error signing in", error);
        }
      );
  };

  handleClick = e => {
    e.preventDefault();
    this.props.type === "register" ? this.authorizeGoogleRegistration() : this.logInWithGoogle();
  };

  render() {
    return <ThirdPartyLoginButton onClick={this.handleClick} icon={GoogleLogo()} copy="Google" />;
  }
}

export default props => (
  <DataConsumer>
    {({ GAPI_CLIENT_ID, setLoginError }) => (
      <GoogleAuth setLoginError={setLoginError} GAPI_CLIENT_ID={GAPI_CLIENT_ID} {...props} />
    )}
  </DataConsumer>
);
