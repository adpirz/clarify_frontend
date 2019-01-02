import React from "react";
import { DataConsumer } from "../DataProvider";
import { Button } from "./PatternLibrary";
import queryString from "query-string";
import styled from "styled-components";
import { lighten, darken } from "polished";

import { colors } from "./PatternLibrary/constants";
import { AuthFormContainer } from "./PatternLibrary";

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LoginHeader = styled.h1`
  font-weight: 400;
  color: ${lighten(0.45, colors.black)};
  font-size: 1em;
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

const ResetErrorMessage = styled.div`
  width: ${INPUT_WIDTH + 3}%;
  display: flex;
  font-size: 0.72em;
  font-weight: 500;
  align-items: flex-start;
  color: ${colors.warningRed};
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
        this.props.history.push("/");
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

  render() {
    return (
      <AuthFormContainer>
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
      </AuthFormContainer>
    );
  }
}

export default props => (
  <DataConsumer>
    {({ postPasswordReset }) => <Login postPasswordReset={postPasswordReset} {...props} />}
  </DataConsumer>
);
