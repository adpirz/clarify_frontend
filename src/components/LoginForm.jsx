import React from "react";
import { DataConsumer } from "../DataProvider";
import { Error, Button } from "./PatternLibrary";
import GoogleAuth from "./GoogleAuth";
import queryString from "query-string";
import styled from "styled-components";
import { lighten, darken } from "polished";
import posed from "react-pose";
import debounce from "lodash/debounce";

import { colors } from "./PatternLibrary/constants";

const LoginFormContainer = styled.div`
  width: 450px;
  min-height: 200px;
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

const INPUT_WIDTH = 60;
const LoginInput = styled.input`
  height: 30px;
  font-size: 0.9em;
  padding: 2px 0.7em;
  margin: 5px;
  border: 1px solid ${darken(0.15, "white")};
  border-radius: 7px;
  background-color: ${darken(0.02, "white")};
  box-shadow: inset 1px 1px 1px 0px rgba(0, 0, 0, 0.08);
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

const ResetErrorMessage = styled.div`
  width: ${INPUT_WIDTH + 3}%;
  display: flex;
  font-size: 0.72em;
  font-weight: 500;
  align-items: flex-start;
  color: ${colors.warningRed};
`;

const ForgotPassword = styled.div`
  margin: 20px auto 0;
  cursor: pointer;
  color: ${lighten(0.6, "black")};
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
    this.props.logUserIn(null, null, accessToken);
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

  handlePasswordConfirmUpdate = e => {
    this.handleUpdate(e, "passwordConfirm");
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
    const { errors, isPasswordReset } = this.props;

    let errorNode = null;
    if (errors.loginError) {
      errorNode = errors.loginError.text;
    }

    const baseLogin = (
      <LoginFormContainer>
        <LoginHeader>Login with Clarify</LoginHeader>
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
        <LoginHeader>Login with Google</LoginHeader>
        <GoogleAuth onSuccess={this.googleLogin} onFailure={err => console.log(err)} />

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
    );

    const passwordReset = (
      <LoginFormContainer>
        <LoginForm onSubmit={this.handleResetSubmit}>
          <LoginHeader>Reset Password</LoginHeader>
          <LoginInput
            type="password"
            id="password-change"
            placeholder="Password"
            value={this.state.passwordChange}
            onChange={this.handlePasswordChangeUpdate}
          />
          <LoginInput
            type="password"
            id="password-confirm"
            placeholder="Confirm Password"
            value={this.state.passwordConfirm}
            onChange={this.handlePasswordConfirmUpdate}
          />
          <ResetErrorMessage>{this.state.passwordResetError}</ResetErrorMessage>
          <Button disabled={!this.state.validResetPassword}>Submit</Button>
        </LoginForm>
      </LoginFormContainer>
    );
    return <div style={{ margin: "5vh auto" }}>{isPasswordReset ? passwordReset : baseLogin}</div>;
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
