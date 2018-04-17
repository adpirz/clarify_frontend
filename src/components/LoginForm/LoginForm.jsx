import React from 'react';


class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.logUserIn = this.logUserIn.bind(this);
  }

  handleInputChange(e) {
    const {name, value} = e.target;
    this.setState({
      [name]: value,
    });
  }

  logUserIn(e) {
    e.preventDefault();
    const { username, password } = this.state;
    if (!username || !password) {
      return null;
    }
    this.props.lazySessionPost(username, password)
  }

  render() {
    const { username, password } = this.state;

    return (
      <div>
        <label>Username</label>
        <input onChange={this.handleInputChange} name="username" value={username} />
        <label>Password</label>
        <input
          onChange={this.handleInputChange}
          name="password"
          value={password}
          type="password"/>
        <button onClick={this.logUserIn}> Sign in </button>
      </div>
    );
  }
}

export default Login;
