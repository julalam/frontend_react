import React, { Component } from 'react';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      usernameValid: false,
      passwordValid: false,
      formValid: false,
      formEmpty: true,
    };
  }

  handleUserInput(event) {
    const field = event.target.name;
    const value = event.target.value;
    this.setState({
      [field]: value
    }, () => {this.validateField(field, value)});
  }

  validateField(field, value) {
    let usernameValid = this.state.usernameValid;
    let passwordValid = this.state.passwordValid;

    switch(field) {
      case 'username':
        usernameValid = value.length > 0;
        break;
      case 'password':
        passwordValid = value.length > 0;
        break;
      default:
        break;
    }
    this.setState({
      usernameValid: usernameValid,
      passwordValid: passwordValid,
      formEmpty: this.state.username.length === 0 && this.state.password.length === 0
    }, this.validateForm);
  }

  validateForm() {
    this.setState({
      formValid:
        this.state.usernameValid && this.state.passwordValid
    })
  }

  handleClick(event) {
    event.preventDefault();
    const data = {
      username: event.target.username.value,
      password: event.target.password.value,
    }
    this.props.onLogin(event, data);
  }

  render() {
    const usernameClass = "input-group" + (!this.state.usernameValid && !this.state.formEmpty ? " has-error" : "");
    const passwordClass = "input-group" + (!this.state.passwordValid && !this.state.formEmpty ? " has-error" : "");
    return (
      <div>
        { this.props.errors && <div className="error">{this.props.errors}</div>}
        <form onSubmit={this.handleClick.bind(this)}>
          <div className="form-group-lg">
            <div className={usernameClass}>
              <div className="input-group-addon">
                <span className="glyphicon glyphicon-user"></span>
              </div>
              <input
                value={this.state.username}
                onChange={this.handleUserInput.bind(this)}
                className="form-control"
                type="text"
                placeholder="Username"
                name="username" />
            </div>
            <div className={passwordClass}>
              <div className="input-group-addon">
                <span className="glyphicon glyphicon-lock"></span>
              </div>
              <input
                value={this.state.password}
                onChange={this.handleUserInput.bind(this)}
                className="form-control"
                type="password"
                placeholder="Password"
                name="password" />
            </div>
            <button className="form-control blue-button" type="submit" disabled={!this.state.formValid}>Sign In</button>
          </div>
        </form>
      </div>
    );
  }
}

export default Login;
