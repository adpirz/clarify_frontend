import React from "react";
import { DataConsumer } from "../../DataProvider";
import { Error } from "../PatternLibrary";
import GoogleAuth from "../GoogleAuth/GoogleAuth";

class Login extends React.Component {
  googleLogin = googleUser => {
    const googleIdToken = googleUser.tokenId;
    this.props.logUserIn(googleIdToken, true)
  }

  render() {
    const { errors } = this.props;

    let errorNode = null;
    if (errors.loginError) {
      errorNode = errors.loginError;
    }

    return (
      <div style={{ margin: "25vh auto" }}>
        <div style={{ margin: '0 auto', textAlign: 'center' }}>
          <p>
            Go ahead and log in with the Google account you usually use at school. <br />
            This is likely also your Illuminate email/username
          </p>
          <GoogleAuth
          clientId="729776830467-i92lfrj8sdj1ospq4rn349dvsu0jbjgi.apps.googleusercontent.com"
          onSuccess={this.googleLogin}
          onFailure={err => console.log(err)}
          />
        </div>
        <Error>{errorNode}</Error>
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
