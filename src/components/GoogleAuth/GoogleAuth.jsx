import React from "react";
import { Button } from "../PatternLibrary";
import PropTypes from "prop-types";

class GoogleAuth extends React.Component {

  propTypes: {
    clientId: PropTypes.string.isRequired,
    onLoginSuccess: PropTypes.func,
    onLoginFailure: PropTypes.func,
    onLogoutSuccess: PropTypes.func,
    type: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.signIn = this.signIn.bind(this);
  }

  componentDidMount() {
    const { clientId, onFailure } = this.props;
    ((document, script, id, callback) => {
      const element = document.getElementsByTagName(script)[0];
      const fjs = element;
      let js = element;
      js = document.createElement(script);
      js.id = id;
      js.src = 'https://apis.google.com/js/client:platform.js';
      if (fjs && fjs.parentNode) {
        fjs.parentNode.insertBefore(js, fjs);
      } else {
        document.head.appendChild(js);
      }
      js.onload = callback;
    })(document, "script", "google-login", () => {
      const params = {
        client_id: clientId
      };

      window.gapi.load("auth2", () => {
        if (!window.gapi.auth2.getAuthInstance()) {
          window.gapi.auth2.init(params).then(
            res => {
              if (res.isSignedIn.get()) {
                this.handleSigninSuccess(res.currentUser.get());
              }
            },
            err => onFailure(err)
          );
        }
      });
      console.log(document.getElementById('google-login-div'));
      window.gapi.signin2.render('google-login-div', {
        clientId: clientId,
        scope: "email",
        width: 150,
        height: 40,
        longtitle: false,
        theme: "dark",
        onsuccess: (res) => this.handleSigninSuccess(res, this.props.onSuccess),
        onfailure: onFailure
      });
      console.log('fire')
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

  signOut() {
    const auth2 = window.gapi.auth2.getAuthInstance();
    if (auth2 != null) {
      auth2.signOut().then(this.props.onLogoutSuccess);
    }
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
    let authNode = (
      <div
        style={{ display: 'inline-block', borderRadius: '8px' }}
        id="google-login-div"
      />
    );
    if (this.props.type === 'logout') {
      authNode = (
        <Button onClick={this.signout} style={{ display: 'inline-block', borderRadius: '8px' }}>
        Sign Out
        </Button>
      );
    }

    return authNode;
  }
}

export default GoogleAuth;
