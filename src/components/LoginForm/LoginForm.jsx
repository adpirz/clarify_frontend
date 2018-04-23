import React from 'react';
import { RaisedButton, TextField } from 'material-ui';
import './LoginForm.css';

const textFieldStyle = {
  height: '50px',
  fontSize: '20px',
};

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

    this.props.lazySessionPost(username, password)
  };

  render() {
    const { username, password } = this.state;

    return (
      <div className="loginContainer">
        <div className="loginTitle">
          Login
        </div>
        <form
          onSubmit={this.logUserIn}
          className="loginForm"
        >
          <div className="loginWrapper">
            <div>
              <TextField
                hintText={
                  <div>
                    <i className="material-icons">
                      person
                    </i>
                    <div className="hintText">
                      &nbsp;E-mail address
                    </div>
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
                    <i className="material-icons">
                      lock
                    </i>
                    <div className="hintText">
                      &nbsp;Password
                    </div>
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
        </form>
      </div>
    );
  }
}

export default Login;
