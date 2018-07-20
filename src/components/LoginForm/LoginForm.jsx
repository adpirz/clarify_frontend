import React from "react";
import styled from "styled-components";
import { DataConsumer } from "../../DataProvider";
import { Button, Error } from "../PatternLibrary";
import TextField from "@material-ui/core/TextField";
import GoogleLogin from "../GoogleLogin/GoogleLogin";

const textFieldStyle = {
  height: "50px",
  fontSize: "20px"
};

const LoginForm = styled.form`
  border: 5px solid rgba(0, 0, 0, 0.2);
  width: 400px;
  padding: 15px;
  margin-bottom: 10px;
`;

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: ""
    };
  }

  handleInputChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  logUserIn = e => {
    e.preventDefault();
    const { username, password } = this.state;
    if (!username || !password) {
      return null;
    }

    this.props.logUserIn({ username, password });
  };

  render() {
    const { username, password } = this.state;
    const { errors } = this.props;

    let errorNode = null;
    if (errors.loginError) {
      errorNode = errors.loginError;
    }

    return (
      <div style={{ margin: "25vh auto" }}>
        <LoginForm onSubmit={this.logUserIn}>
          <div>
            <div>
              <TextField
                placeholder="E-mail Address"
                type="text"
                required
                name="username"
                value={username}
                onChange={this.handleInputChange}
                style={textFieldStyle}
              />
            </div>
            <div>
              <TextField
                placeholder="Password"
                type="password"
                required
                fullWidth
                name="password"
                value={password}
                onChange={this.handleInputChange}
                style={textFieldStyle}
              />
            </div>
            <div style={{ textAlign: "center" }}>
              <Button primary> Login </Button>
            </div>
            <div style={{textAlign: "center", marginTop:"1em" }}>
              <GoogleLogin clientId="729776830467-i92lfrj8sdj1ospq4rn349dvsu0jbjgi.apps.googleusercontent.com" />
            </div>
          </div>
          <Error>{errorNode}</Error>
        </LoginForm>
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
