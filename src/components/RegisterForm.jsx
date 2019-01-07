import React from "react";
import queryString from "query-string";
import styled from "styled-components";
import { lighten, darken } from "polished";
import { NavLink } from "react-router-dom";

import { AuthFormContainer, ThirdPartyLoginButton } from "./PatternLibrary";
import { colors } from "./PatternLibrary/constants";
import { GoogleAuth } from ".";
import { DataConsumer } from "../DataProvider";

const CLEVER_CLIENT_ID = process.env.REACT_APP_CLEVER_CLIENT_ID;
const CLEVER_REDIRECT_URL = process.env.REACT_APP_CLEVER_REDIRECT_URL || "http://localhost:3000";

const IntegrationContainer = styled.div`
  width: 80%;
  display: flex;
  justify-content: space-between;
  padding-top: 10px;
`;

const CleverLink = styled.a`
  display: inline-block;
  font-weight: bold;
  color: ${colors.cleverBlue};
  text-decoration: none;

  &:hover {
    color: ${darken(0.1, colors.cleverBlue)};
  }
`;

const CleverIcon = styled.span`
  color: ${colors.cleverBlue};
  font-weight: bold;
`;

const LogInLink = styled(NavLink)`
  margin: 20px auto 0;
  cursor: pointer;
  color: ${colors.textGrey};
  font-size: 0.9em;
  font-weight: 400;
  &:hover {
    color: ${lighten(0.6, colors.black)};
  }

  &:active {
    color: ${colors.deltaRed};
  }
`;

class RegisterForm extends React.Component {
  authorizeClever = () => {};

  getOAuthCode = () => {
    const { search } = this.props.location;
    const queryParams = queryString.parse(search);
    return queryParams.code || undefined;
  };

  render() {
    const code = this.getOAuthCode();
    const { syncWithClever, syncUserWithGoogleClassroom, user, history } = this.props;

    if (code && !user) {
      syncWithClever(code).then(() => history.push("/"));
    }

    const URL =
      "https://clever.com/oauth/authorize?" +
      "response_type=code" +
      "&redirect_uri=" +
      encodeURIComponent(CLEVER_REDIRECT_URL) +
      "&client_id=" +
      CLEVER_CLIENT_ID +
      // IMPORTANT: We use this in the demo to always send the user to log in via the Clever SSO demo district. In your app, remove this!
      "&district_id=5b2ad81a709e300001e2cd7a";

    return (
      <AuthFormContainer>
        <h1>Register with</h1>
        <IntegrationContainer>
          <GoogleAuth
            type="register"
            onSuccess={syncUserWithGoogleClassroom}
            onFailure={err => console.log(err)}
          />
          <CleverLink href={URL}>
            <ThirdPartyLoginButton noNav copy="Clever" icon={<CleverIcon>C</CleverIcon>} />
          </CleverLink>
        </IntegrationContainer>
        <LogInLink to="/login">Log In</LogInLink>
      </AuthFormContainer>
    );
  }
}

export default props => (
  <DataConsumer>
    {({ syncUserWithGoogleClassroom, user, setLoginError, startCleverOAuth }) => (
      <RegisterForm
        syncUserWithGoogleClassroom={syncUserWithGoogleClassroom}
        startCleverOAuth={startCleverOAuth}
        user={user}
        setLoginError={setLoginError}
        {...props}
      />
    )}
  </DataConsumer>
);
