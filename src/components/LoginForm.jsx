import React from "react";
import { DataConsumer } from "../DataProvider";
import { Error, Button } from "./PatternLibrary";
import GoogleAuth from "./GoogleAuth";
import styled from "styled-components";
import { lighten, darken } from "polished";

import { colors } from "./PatternLibrary/constants";

const CLEVER_CLIENT_ID = process.env.REACT_APP_CLEVER_CLIENT_ID;
const CLEVER_REDIRECT_URL = process.env.REACT_APP_CLEVER_REDIRECT_URL || "http://localhost:3000";

const LoginFormContainer = styled.div`
  width: 450px;
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
  color: ${lighten(0.6, colors.black)};
  font-size: 0.75em;
  margin: 20px;
  text-align: center;
  line-height: 1.42em;
`;

const LoginHeader = styled.h1`
  font-weight: 400;
  color: ${lighten(0.45, colors.black)};
  font-size: 1em;
  margin: 30px auto 5px;
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

const LoginInput = styled.input`
  width: 60%;
  height: 30px;
  font-size: 0.9em;
  padding: 2px 0.7em;
  margin: 5px;
  border: 1px solid ${darken(0.15, "white")};
  border-radius: 7px;
  background-color: ${darken(0.02, "white")};
  box-shadow: inset 1px 1px 1px 0px rgba(0, 0, 0, 0.08);
`;

class Login extends React.Component {
  state = {
    username: "",
    password: "",
  };

  googleLogin = accessToken => {
    this.props.logUserIn(null, null, accessToken);
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
      <div style={{ margin: "20vh auto" }}>
        <LoginFormContainer>
          <LoginHeader>Login with Google</LoginHeader>
          <GoogleAuth onSuccess={this.googleLogin} onFailure={err => console.log(err)} />
          <LoginHeader>Login with Clever</LoginHeader>
          <a href={URL}>
            <CleverImage src="./clever_login_button.png" />
          </a>
          <LoginHeader>Login with Clarify</LoginHeader>
          <LoginInput
            type="text"
            id="username-input"
            placeholder="Username"
            value={this.state.username}
            onChange={this.handleUsernameUpdate}
          />
          <LoginInput
            type="password"
            id="password-input"
            placeholder="Password"
            value={this.state.password}
            onChange={this.handlePasswordUpdate}
          />
          <Button onClick={this.initiateClarifyLogin}>Log in</Button>
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
