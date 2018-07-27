import React from "react";
import { DataConsumer } from "../../DataProvider";
import { Error } from "../PatternLibrary";
import GoogleAuth from "../GoogleAuth/GoogleAuth";
import styled from "styled-components";
import { lighten } from "polished";

const LoginFormContainer = styled.div`
  width: 400px;
  height: 300px;
  border-radius: 20px;
  background: linear-gradient(180deg, ${lighten(0.6, "gray")} 70%, ${lighten(0.47, "gray")});
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  justify-content: center;
  box-shadow: 0 3px 8px 3px ${lighten(0.35, "gray")};
  padding: 0 0 20px;
`;

const LoginHelperText = styled.div`
  color: ${lighten(0.7, "black")};
  font-size: 0.75em;
  margin: auto 0 0;
  text-align: center;
  line-height: 1.42em;
`;

const LoginHeader = styled.h1`
  font-weight: 400;
  color: ${lighten(0.45, "black")};
  font-size: 1.8em;
  margin: auto auto 20px;
`;

const EmailLink = styled.a`
  color: ${lighten(0.6, "black")};
  text-decoration: none;

  &:hover {
    color: ${lighten(0.75, "black")};
  }

  &:active {
    color: ${lighten(0.2, "black")};
  }
`;

class Login extends React.Component {
  googleLogin = accessToken => {
    this.props.logUserIn(accessToken, true)
  }

  render() {
    const { errors } = this.props;

    let errorNode = null;
    if (errors.loginError) {
      errorNode = errors.loginError.text;
    }

    return (
      <div style={{ margin: "25vh auto" }}>
        <LoginFormContainer>
          <LoginHeader>Login with Google</LoginHeader>
          <GoogleAuth
          onSuccess={this.googleLogin}
          onFailure={err => console.log(err)}
          />
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
