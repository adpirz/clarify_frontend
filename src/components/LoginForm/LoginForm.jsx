import React from 'react';
import styled from 'styled-components';
import { RaisedButton, TextField } from 'material-ui';

const textFieldStyle = {
  height: '50px',
  fontSize: '20px',
};

const LoginForm = styled.form`
  border: 5px solid rgba(0, 0, 0, .2);
  width: 300px;
  padding: 15px;
  margin: 25vh auto;
`;

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    };
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  logUserIn = (e) => {
    e.preventDefault();
    const { username, password } = this.state;
    if (!username || !password) {
      return null;
    }

    this.props.logUserIn({username, password});
  };

  render() {
    const { username, password } = this.state;

    return (
      <LoginForm
        onSubmit={this.logUserIn}
      >
        <div >
          <div>
            <TextField
              hintText={
                <div>
                  <i className="fas fa-user" />
                  &nbsp;E-mail address
                </div>
              }
              type="text"
              required
              fullWidth
              name="username"
              value={username}
              onChange={this.handleInputChange}
              style={textFieldStyle}
            />
          </div>
          <div>
            <TextField
              hintText={
                <div>
                  <i className="fas fa-lock" />
                  &nbsp;Password
                </div>
              }
              type="password"
              required
              fullWidth
              name="password"
              value={password}
              onChange={this.handleInputChange}
              style={textFieldStyle}
            />
          </div>
          <div>
            <RaisedButton
              label="Login"
              type="Submit"
              fullWidth
              primary
              labelStyle={{
                letterSpacing: '1.5px',
                fontSize: '20px',
                lineHeight: '40px',
              }}
              style={{
                marginBottom: '10px',
                height: '40px',
              }}
            />
          </div>
        </div>
      </LoginForm>
    );
  }
}

export default Login;
