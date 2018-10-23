import React from "react";
import styled from 'styled-components';
import PropTypes from "prop-types";
import { GoogleLogo } from '../PatternLibrary';
import { colors, fontSizes } from '../PatternLibrary/constants';

const GAPI_CLIENT_ID = process.env.REACT_APP_GAPI_CLIENT_ID || "729776830467-i92lfrj8sdj1ospq4rn349dvsu0jbjgi.apps.googleusercontent.com";

const GoogleButton = styled.button`
  border-radius: 0;
  background-color: ${colors.googleBlue};
  width: 250px;
  height: 50px;
  font-size: ${fontSizes.medium};
  color: ${colors.white};
  display: flex;
  border: 1px solid ${colors.googleBlue}
  margin: 0 auto;
  padding: 0;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.25);

  &:hover {
    box-shadow: 0 0 3px 3px rgba(66,133,244,.3);
  }
`;

const GoogleLogoContainer = styled.div`
  height: 48px;
  background-color: ${colors.white};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
`;

const ButtonLabel = styled.span`
  flex-grow: 3;
`;

class GoogleAuth extends React.Component {
  propTypes: {
    onSuccess: PropTypes.func.isRequired,
    onFailure: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.signIn = this.signIn.bind(this);
  }

  componentDidMount() {
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
          window.gapi.auth2.init({clientId: GAPI_CLIENT_ID});
        }
      });
    });
  }

  signIn(e) {
    if (e) {
      e.preventDefault(); // to prevent submit if used within form
    }
    const auth2 = window.gapi.auth2.getAuthInstance();
    const { onFailure } = this.props;
    const options = {
      prompt: 'select_account'
    };
    auth2.signIn(options).then(res => this.handleSigninSuccess(res), err => onFailure(err));
  }

  handleSigninSuccess(res) {
    const { id_token: accessToken } = res.getAuthResponse();
    this.props.onSuccess(accessToken);
  }

  render() {
    return (
      <GoogleButton onClick={this.signIn}>
        <GoogleLogoContainer>
          <GoogleLogo />
        </GoogleLogoContainer>
        <ButtonLabel>
          Sign in
        </ButtonLabel>
      </GoogleButton>
    );
  }
}

export default GoogleAuth;
