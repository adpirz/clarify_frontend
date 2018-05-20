import React from 'react';
import styled from 'styled-components';
import { Button, Error } from '../PatternLibrary';
import { TextField } from 'material-ui';

const textFieldStyle = {
  height: '50px',
  fontSize: '20px',
};

const LoginForm = styled.form`
  border: 5px solid rgba(0, 0, 0, .2);
  width: 400px;
  padding: 15px;
  margin: 25vh auto;
`;

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      error: null,
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

    this.props.logUserIn({username, password}).then((resp) => {
      if (resp.error) {
        this.setState({error: resp.error});
      }
    });
  };

  render() {
    const { username, password, error } = this.state;

    let errorNode = null;
    if (error) {
      errorNode = `There was an error logging in: ${this.state.error}. Shoot an email over to
        help@clarify.com and we'll take a look.`;
    }

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
          <div style={{textAlign: 'center'}}>
            <Button primary> Login </Button>
          </div>
        </div>
        <Error>
          {errorNode}
        </Error>
      </LoginForm>
    );
  }
}

export default Login;
