import React, { Component } from 'react';
import { Redirect } from 'react-router';
import Footer from './footer';
import axios from 'axios';


class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      languages: [],
      countries: [],
      username: '',
      email: '',
      password: '',
      usernameValid: false,
      emailValid: false,
      passwordValid: false,
      languageValid: false,
      formValid: false,
      formEmpty: true,
    };
  }

  componentWillMount() {
    axios.get('http://localhost:8080/languages').then((response) => {
      const languages = Array.from(response.data);
      this.setState({
        languages: languages,
      });
    });

    axios.get('http://localhost:8080/countries').then((response) => {
      const countries = Array.from(response.data);
      this.setState({
        countries: countries,
      });
    });
  }

  handleUserInput(event) {
    const field = event.target.name;
    const value = event.target.value;
    this.setState({
      [field]: value
    }, () => {this.validateField(field, value) });
  }

  validateField(field, value) {
    let usernameValid = this.state.usernameValid;
    let emailValid = this.state.emailValid;
    let passwordValid = this.state.passwordValid;
    let languageValid = this.state.languageValid;

    switch(field) {
      case 'username':
        usernameValid = value.length >= 3 && value.length <= 15;
        break;
      case 'email':
        emailValid = value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
        break;
      case 'password':
        passwordValid = value.length >= 6 && value.length <= 10;
        break;
      case 'language':
        languageValid = value.length > 0;
        break;
      default:
        break;
    }
    this.setState({
      usernameValid: usernameValid,
      emailValid: emailValid,
      passwordValid: passwordValid,
      languageValid: languageValid,
      formEmpty: this.state.username.length === 0 && this.state.email.length === 0 && this.state.password.length === 0 && this.state.language.length === 0
    }, this.validateForm);
  }

  validateForm() {
    this.setState({
      formValid: this.state.usernameValid && this.state.emailValid && this.state.passwordValid && this.state.language
    })
  }

  handleSubmit(event) {
    event.preventDefault();
    const user = {
      username: event.target.username.value,
      email: event.target.email.value,
      password: event.target.password.value,
      country: event.target.country.value,
      language: event.target.language.value,
    };
    this.props.onRegistration(event, user);
  }

  render() {
    const usernameClass = "input-group-lg" + (!this.state.usernameValid && !this.state.formEmpty ? " has-error" : "");

    const emailClass = "input-group-lg" + (!this.state.emailValid && !this.state.formEmpty ? " has-error" : "");

    const passwordClass = "input-group-lg" + (!this.state.passwordValid && !this.state.formEmpty ? " has-error" : "");

    const languageClass = "input-group-lg" + (!this.state.languageValid && !this.state.formEmpty ? " has-error" : "");

    const languageOptions = this.state.languages.map(language => {
      return <option key={language.id} value={language.code}>{language.native_name}</option>
    });

    const countryOptions = this.state.countries.map(country => {
      return <option key={country.id} value={country.name}>{country.name}</option>
    });

    if (this.props.session) {
      return (
        <Redirect to='/' />
      )
    } else {
      return (
        <div className="row">
            <img className="logo-sm" src={require("../assets/logo-name-circle.png")} alt="SpeakEasy logo" />

            <div className="registration">
            <h2>Sign Up</h2>

            <form onSubmit={this.handleSubmit.bind(this)}>

              <div className={usernameClass}>
                <input id="username" className="form-control" type="text" placeholder="Username" name="username" value={this.state.username} onChange={this.handleUserInput.bind(this)} />
                <div id="username-note" className="note">Username must be between 3 and 15 characters.</div>
              </div>

              <div className={emailClass}>
                <input id="email" className="form-control" type="text" placeholder="Email" name="email" value={this.state.email} onChange={this.handleUserInput.bind(this)} />
                <div id="email-note" className="note">Please enter email in following format: name@gmail.com.</div>
              </div>

              <div className={passwordClass}>
                <input id="password" className="form-control" type="password" placeholder="Password" name="password" value={this.state.password} onChange={this.handleUserInput.bind(this)} />
                <div id="password-note" className="note">Select a 6-10 character password that begins with a letter and contains at least one number. Your password may not contain your email, word "password", or any blank spaces.</div>
              </div>

              <div className="input-group-lg">
                <select className="form-control" name="country">
                  <option value="" disabled selected>Select Country</option>
                  {countryOptions}
                </select>
              </div>

              <div className={languageClass}>
                <select className="form-control" name="language" onChange={this.handleUserInput.bind(this)}>
                  <option value="" disabled selected>Select Language</option>
                  {languageOptions}
                </select>
              </div>

              <div className="input-group-lg">
                <button className="form-control orange-button" type="submit" disabled={!this.state.formValid}>Create Account</button>
              </div>

            </form>
          </div>
          <Footer />
        </div>
      );
    }
  }
}

export default Registration;
