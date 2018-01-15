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
    }, this.validateForm);
  }

  validateForm() {
    this.setState({
      formValid: this.state.usernameValid && this.state.passwordValid
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
    return (
      <div>
        { this.props.errors && <div>{this.props.errors}</div>}
        <form onSubmit={this.handleClick.bind(this)}>
          <div className="form-group-lg">
            <div className="input-group">
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
            <div className="input-group">
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
