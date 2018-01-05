import React, { Component } from 'react';

class Login extends Component {

  handleClick(event) {
    event.preventDefault();
    this.props.onClick(event, "Julia");
  }

  render() {
    return (
      <div className="login">
        <form onSubmit={this.handleClick.bind(this)}>
          <input type="text" placeholder="Username" name="username" />
          <button type="submit">Log In</button>
        </form>
      </div>
    );
  }
}

export default Login;
