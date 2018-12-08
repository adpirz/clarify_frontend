import React from "react";
import { DataConsumer } from "../DataProvider";
import { Error } from "./PatternLibrary";
import GoogleAuth from "./GoogleAuth";
import styled from "styled-components";
import { lighten } from "polished";

import { colors } from "./PatternLibrary/constants";

const CLEVER_CLIENT_ID = process.env.REACT_APP_CLEVER_CLIENT_ID;
const CLEVER_REDIRECT_URL = process.env.REACT_APP_CLEVER_REDIRECT_URL || "http://localhost:3000";

const LoginFormContainer = styled.div`
  width: 400px;
  min-height: 300px;
  border-radius: 20px;
  background: linear-gradient(180deg, ${lighten(0.6, "grey")} 70%, ${lighten(0.47, "grey")});
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  justify-content: center;
  box-shadow: 0 3px 8px 3px ${lighten(0.35, "grey")};
  padding: 0 0 20px;
`;

const LoginHelperText = styled.div`
  color: ${lighten(0.7, colors.black)};
  font-size: 0.75em;
  margin: auto 0 0;
  text-align: center;
  line-height: 1.42em;
`;

const LoginHeader = styled.h1`
  font-weight: 400;
  color: ${lighten(0.45, colors.black)};
  font-size: 1.8em;
  margin: 20px auto;
`;

const EmailLink = styled.a`
  color: ${lighten(0.6, colors.black)};
  text-decoration: none;

  &:hover {
    color: ${lighten(0.75, colors.black)};
  }

  &:active {
    color: ${lighten(0.2, colors.black)};
  }
`;

const CleverImage = styled.img`
  width: 250px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);

  &:hover {
    box-shadow: 0 0 3px 3px rgba(66, 133, 244, 0.3);
  }
`;

class Login extends React.Component {
  state = {
    username: "",
    password: "",
  };

  googleLogin = accessToken => {
    this.props.logUserIn(accessToken);
  };

  handleUsernameUpdate = e => {
    const { value } = e.target;
    this.setState({ username: value });
  };

  handlePasswordUpdate = e => {
    const { value } = e.target;
    this.setState({ password: value });
  };

  initiateClarifyLogin = () => {
    this.props.logUserIn(this.state.username, this.state.password);
  };

  render() {
    const { errors } = this.props;

    let errorNode = null;
    if (errors.loginError) {
      errorNode = errors.loginError.text;
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
      <div style={{ margin: "25vh auto" }}>
        <LoginFormContainer>
          <LoginHeader>Login with Google</LoginHeader>
          <GoogleAuth onSuccess={this.googleLogin} onFailure={err => console.log(err)} />
          <LoginHeader>Login with Clever</LoginHeader>
          <a href={URL}>
            <CleverImage src="./clever_login_button.png" />
          </a>
          <LoginHeader>Login with Clarify</LoginHeader>
          <label htmlFor="username-input">Username</label>
          <input
            type="text"
            id="username-input"
            value={this.state.username}
            onChange={this.handleUsernameUpdate}
          />
          <label htmlFor="password-input">Password</label>
          <input
            type="password"
            id="password-input"
            value={this.state.password}
            onChange={this.handlePasswordUpdate}
          />
          <button onClick={this.initiateClarifyLogin}>Log in</button>
          <Error>{errorNode}</Error>
          <LoginHelperText>
            This should be the same account you use to login with <strong>Illuminate</strong>.
            <br />
            Contact your system administrator if you need account information.
            <br />
            Still not sure? Reach out to{" "}
            <strong>
              <EmailLink href="mailto:help@clarify.school">help@clarify.school</EmailLink>.
            </strong>
          </LoginHelperText>
        </LoginFormContainer>
      </div>
    );
  }
}

export default props => (
  <DataConsumer>
    {({ isLoading, logUserIn, errors }) => (
      <Login isLoading={isLoading} logUserIn={logUserIn} errors={errors} {...props} />
    )}
  </DataConsumer>
);
