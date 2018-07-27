import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { lighten } from "polished";

const GAPI_CLIENT_ID = process.env.REACT_APP_GAPI_CLIENT_ID;

const GoogleLoginPlaceholder = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  font-weight: 400;
  width: 150px;
  height: 40px;
  background: none;
  color: ${lighten(0.5, "black")};
  font-size: 0.7em;
`;

class GoogleAuth extends React.Component {
  static propTypes = {
    onLoginSuccess: PropTypes.func,
    onLoginFailure: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.signIn = this.signIn.bind(this);
  }

  componentDidMount() {
    const { onFailure } = this.props;
    ((document, script, id, callback) => {
      const element = document.getElementsByTagName(script)[0];
      const fjs = element;
      let js = element;
      js = document.createElement(script);
      js.id = id;
      js.src = "https://apis.google.com/js/client:platform.js";
      if (fjs && fjs.parentNode) {
        fjs.parentNode.insertBefore(js, fjs);
      } else {
        document.head.appendChild(js);
      }
      js.onload = callback;
    })(document, "script", "google-login", () => {
      window.gapi.load("auth2", () => {
        if (!window.gapi.auth2.getAuthInstance()) {
          window.gapi.auth2.init({ clientId: GAPI_CLIENT_ID }).then(() => {
            window.gapi.signin2.render("google-login-div", {
              clientId: GAPI_CLIENT_ID,
              scope: "email",
              width: 150,
              height: 40,
              longtitle: false,
              theme: "dark",
              onsuccess: res => this.handleSigninSuccess(res, this.props.onSuccess),
              onfailure: onFailure
            });
          });
        }
      });
    });
  }

  signIn(e) {
    if (e) {
      e.preventDefault(); // to prevent submit if used within form
    }
    const auth2 = window.gapi.auth2.getAuthInstance();
    const { onFailure, prompt } = this.props;
    const options = {
      prompt
    };
    auth2.signIn(options).then(res => this.handleSigninSuccess(res), err => onFailure(err));
  }

  handleSigninSuccess(res, successCallback) {
    /*
          offer renamed response keys to names that match use
        */
    const basicProfile = res.getBasicProfile();
    const authResponse = res.getAuthResponse();
    res.googleId = basicProfile.getId();
    res.tokenObj = authResponse;
    res.tokenId = authResponse.id_token;
    res.accessToken = authResponse.access_token;
    res.profileObj = {
      googleId: basicProfile.getId(),
      imageUrl: basicProfile.getImageUrl(),
      email: basicProfile.getEmail(),
      name: basicProfile.getName(),
      givenName: basicProfile.getGivenName(),
      familyName: basicProfile.getFamilyName()
    };
    successCallback ? successCallback(res) : this.props.onSuccess(res);
  }

  render() {
    return (
      <GoogleLoginPlaceholder
        style={{ display: "inline-block", borderRadius: "8px" }}
        id="google-login-div"
      />
    );
  }
}

export default GoogleAuth;
