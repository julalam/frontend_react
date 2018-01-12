import React, { Component } from 'react';

class Login extends Component {

  handleClick(event) {
    event.preventDefault();
    const username = event.target.username.value;
    this.props.onLogin(event, username);
  }

  render() {
    return (
      <div className="login">
        { this.props.errors && <div>{this.props.errors}</div>}
        <form onSubmit={this.handleClick.bind(this)}>
          <div className="input-group-lg">
            <input className="form-control" type="text" placeholder="Username" name="username" />
            <input className="form-control" type="password" placeholder="Password" name="password" />
            <button className="form-control" type="submit">Sign In</button>
          </div>
        </form>
      </div>
    );
  }
}

export default Login;
