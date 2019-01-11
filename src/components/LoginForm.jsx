import React from "react";
import { NavLink } from "react-router-dom";
import queryString from "query-string";
import styled from "styled-components";
import { lighten, darken } from "polished";
import posed from "react-pose";
import debounce from "lodash/debounce";

import { DataConsumer } from "../DataProvider";
import { Error, Button, ThirdPartyLoginButton, AuthFormContainer } from "./PatternLibrary";
import { colors, effects } from "./PatternLibrary/constants";
import { GoogleAuth } from ".";

const CLEVER_CLIENT_ID = process.env.REACT_APP_CLEVER_CLIENT_ID;
const CLEVER_REDIRECT_URL = process.env.REACT_APP_CLEVER_REDIRECT_URL || "http://localhost:3000";

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
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
  margin: 0;
`;

const IntegrationContainer = styled.div`
  display: flex;
  width: 80%;
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

const LoginInput = styled.input`
  height: 30px;
  font-size: 0.9em;
  padding: 2px 0.7em;
  margin: 5px;
  border: 1px solid ${darken(0.15, "white")};
  border-radius: 7px;
  background-color: ${darken(0.02, "white")};
  box-shadow: ${effects.inputBoxShadow};
`;

const transition = {
  duration: 100,
};
const ResetEmailPosed = posed.div({
  closed: {
    height: "0",
    transition,
  },
  open: {
    height: "auto",
    transition,
  },
});

const ResetEmailContainer = styled(ResetEmailPosed)`
  width: 100%;
  background-color: ${darken(0.06, "white")};
  box-shadow: inset 0px 3px 8px 0px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
  text-align: center;
  overflow: hidden;
`;

const ForgotPassword = styled.div`
  cursor: pointer;
  color: ${colors.textGrey};
  text-align: center;
  font-size: 0.9em;
  font-weight: 400;
  &:hover {
    color: ${colors.errorOrange};
  }

  &:active {
    color: ${colors.deltaRed};
  }
`;

const RegisterLink = styled(NavLink)`
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

const DividOr = styled.span`
  margin: 15px 0px;
`;

const CleverIcon = styled.span`
  color: ${colors.cleverBlue};
  font-weight: bold;
`;

class Login extends React.Component {
  state = {
    username: "",
    password: "",
    passwordChange: "",
    passwordConfirm: "",
    passwordResetError: "",
    resetEmail: "",
    validResetPassword: null,
    resetEmailOpen: false,
  };

  googleLogin = accessToken => {
    this.props.logUserIn(null, null, accessToken).then(resp => {
      this.props.history.push("/");
    });
  };

  handleUpdate = (e, key) => {
    const { value } = e.target;
    const { passwordChange, passwordConfirm } = this.state;
    let resetValidation;
    if (key === "passwordChange") {
      resetValidation = this.validatePasswordReset(value, passwordConfirm);
    } else if (key === "passwordConfirm") {
      resetValidation = this.validatePasswordReset(passwordChange, value);
    } else {
      resetValidation = this.validatePasswordReset();
    }

    this.setState({ [key]: value, ...resetValidation });
  };
  handleUsernameUpdate = e => {
    this.handleUpdate(e, "username");
  };

  handlePasswordUpdate = e => {
    this.handleUpdate(e, "password");
  };

  handlePasswordChangeUpdate = e => {
    this.handleUpdate(e, "passwordChange");
  };

  handleResetEmailChange = e => {
    this.handleUpdate(e, "resetEmail");
  };

  handleResetSubmit = e => {
    const { postPasswordReset, location, history } = this.props;
    e.preventDefault();
    const { validResetPassword, passwordChange, resetEmail } = this.state;
    if (resetEmail) {
      return postPasswordReset({ email: resetEmail }).then(() => {
        this.setState({ resetEmailOpen: false });
      });
    }
    if (validResetPassword) {
      const queryParams = queryString.parse(location.search);
      if (queryParams.token) {
        return postPasswordReset({
          reset_token: queryParams.token,
          new_password: passwordChange,
        }).then(resp => {
          history.push("/");
        });
      } else {
        this.setState({ passwordResetError: "Invalid or missing token." });
      }
    }
  };

  toggleResetEmailContainer = debounce(() => {
    this.setState(({ resetEmailOpen }) => ({ resetEmailOpen: !resetEmailOpen }));
  }, 100);

  validatePasswordReset(passwordChange, passwordConfirm) {
    let passwordResetError;
    let validResetPassword;

    if (!passwordChange && !passwordConfirm) {
      passwordResetError = null;
      validResetPassword = null;
    } else if (passwordChange !== passwordConfirm) {
      passwordResetError = "Passwords don't match";
      validResetPassword = false;
    } else if (passwordChange.length < 8) {
      passwordResetError = "Password must be at least 8 characters.";
      validResetPassword = false;
    } else {
      passwordResetError = null;
      validResetPassword = true;
    }
    return { passwordResetError, validResetPassword };
  }

  initiateClarifyLogin = () => {
    this.props.logUserIn(this.state.username, this.state.password);
  };

  render() {
    const { errors } = this.props;

    let errorNode = null;
    if (errors.loginError) {
      errorNode = errors.loginError;
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
        <Error>{errorNode}</Error>
        <LoginHeader>Log in with:</LoginHeader>
        <IntegrationContainer>
          <GoogleAuth
            type="login"
            onSuccess={this.googleLogin}
            onFailure={err => console.log(err)}
          />
          <CleverLink href={URL}>
            <ThirdPartyLoginButton noNav copy="Clever" icon={<CleverIcon>C</CleverIcon>} />
          </CleverLink>
        </IntegrationContainer>
        <DividOr>or</DividOr>
        <LoginHeader>Clarify</LoginHeader>
        <LoginForm onSubmit={this.initiateClarifyLogin}>
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
          <Button>Log in</Button>
        </LoginForm>
        <RegisterLink to="/register">Register</RegisterLink>
        <ForgotPassword onClick={this.toggleResetEmailContainer}>Forgot password?</ForgotPassword>
        <ResetEmailContainer pose={this.state.resetEmailOpen ? "open" : "closed"}>
          <LoginInput
            placeholder="Email address"
            value={this.state.resetEmail}
            onChange={this.handleResetEmailChange}
          />
          <Button style={{ margin: "5px auto" }} onClick={this.handleResetSubmit}>
            Submit Email
          </Button>
        </ResetEmailContainer>
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
      </AuthFormContainer>
    );
  }
}

export default props => (
  <DataConsumer>
    {({ isLoading, logUserIn, errors, postPasswordReset, messages }) => (
      <Login
        isLoading={isLoading}
        logUserIn={logUserIn}
        errors={errors}
        postPasswordReset={postPasswordReset}
        messages={messages}
        {...props}
      />
    )}
  </DataConsumer>
);
