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
      formErrors: {username: '', email: '', password: ''},
      usernameValid: false,
      emailValid: false,
      passwordValid: false,
      formValid: false,
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
    let formErrors = this.state.formErrors;
    let usernameValid = this.state.usernameValid;
    let emailValid = this.state.emailValid;
    let passwordValid = this.state.passwordValid;

    switch(field) {
      case 'username':
        usernameValid = value.length > 0 && value.length <= 15;
        formErrors.username = usernameValid ? '' : 'is invalid';
        console.log(usernameValid);
        break;
      case 'email':
        emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        formErrors.email = emailValid ? '' : 'is invalid';
        console.log(emailValid);
        break;
      case 'password':
        passwordValid = value.length >= 6 && value.length <= 10;
        formErrors.password = passwordValid ? '' : 'is invalid';
        break;
      default:
        break;
    }

    this.setState({
      formErrors: formErrors,
      usernameValid: usernameValid,
      emailValid: emailValid,
      passwordValid: passwordValid,
    }, this.validateForm);
  }

  validateForm() {
    this.setState({
      formValid: this.state.usernameValid && this.state.emailValid && this.state.passwordValid
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
    const errors = Object.keys(this.state.formErrors).map((field, i) => {
      if (this.state.formErrors[field].length > 0) {
        return (
          <p key={i}>{field}: {this.state.formErrors[field]}</p>
        )
      } else {
        return '';
      }
    });

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
          <div className="registration">
            <img className="logo-sm" src={require("../assets/logo-name.png")} />

            <h2>Sign Up</h2>

            <div>{errors}</div>

            <form onSubmit={this.handleSubmit.bind(this)}>

              <div className="input-group-lg">
                <input className="form-control" type="text" placeholder="Username" name="username" value={this.state.username} onChange={this.handleUserInput.bind(this)} />
                <input className="form-control" type="text" placeholder="Email" name="email" value={this.state.email} onChange={this.handleUserInput.bind(this)} />
                <input className="form-control" type="password" placeholder="Password" name="password" value={this.state.password} onChange={this.handleUserInput.bind(this)} />
                <select className="form-control" name="country">
                  <option value="" disabled selected>Select Country</option>
                  {countryOptions}
                </select>
                <select className="form-control" name="language">
                  <option value="" disabled selected>Select Language</option>
                  {languageOptions}
                </select>
                <button className="form-control orange-button" type="submit" disabled={!this.state.formValid} >Create Account</button>
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
