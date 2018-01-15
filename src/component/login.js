import React, { Component } from 'react';

class Login extends Component {

  handleClick(event) {
    event.preventDefault();
    const username = event.target.username.value;
    this.props.onLogin(event, username);
  }

  render() {
    return (
      <div>
        { this.props.errors && <div>{this.props.errors}</div>}
        <form onSubmit={this.handleClick.bind(this)}>
          <div className="form-group-lg">
            <div className="input-group">
              <div className="input-group-addon">
                <span className="glyphicon glyphicon-user"></span>
              </div>
              <input className="form-control" type="text" placeholder="Username" name="username" />
            </div>
            <div className="input-group">
              <div className="input-group-addon">
                <span className="glyphicon glyphicon-lock"></span>
              </div>
              <input className="form-control" type="password" placeholder="Password" name="password" />
            </div>
            <button className="form-control blue-button" type="submit">Sign In</button>
          </div>
        </form>
      </div>
    );
  }
}

export default Login;
