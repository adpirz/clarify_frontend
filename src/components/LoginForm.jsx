import React from "react";
import { DataConsumer } from "../DataProvider";
import { Error } from "./PatternLibrary";
import GoogleAuth from "./GoogleAuth";
import styled from "styled-components";
import { lighten } from "polished";

import { colors } from "./PatternLibrary/constants";
import clever from "../CleverAuth";

const LoginFormContainer = styled.div`
  width: 400px;
  height: 300px;
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
  margin: auto auto 20px;
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

class Login extends React.Component {
  googleLogin = accessToken => {
    this.props.logUserIn(accessToken, true);
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
      encodeURIComponent(clever.redirectURL) +
      "&client_id=" +
      clever.clientId +
      // IMPORTANT: We use this in the demo to always send the user to log in via the Clever SSO demo district. In your app, remove this!
      "&district_id=5b2ad81a709e300001e2cd7a";

    return (
      <div style={{ margin: "25vh auto" }}>
        <LoginFormContainer>
          <LoginHeader>Login with Google</LoginHeader>
          <GoogleAuth onSuccess={this.googleLogin} onFailure={err => console.log(err)} />
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
            <a href={URL}>
              <button>CLEVER TEST: {clever.clientId}</button>
            </a>
          </LoginHelperText>
        </LoginFormContainer>
      </div>
    );
  }
}

export default props => (
  <DataConsumer>
    {({ isLoading, logUserIn, errors, clever }) => (
      <Login
        isLoading={isLoading}
        logUserIn={logUserIn}
        errors={errors}
        clever={clever}
        {...props}
      />
    )}
  </DataConsumer>
);
