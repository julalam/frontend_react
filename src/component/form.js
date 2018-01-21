import React, { Component } from 'react';
import axios from 'axios';


class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      languages: [],
      countries: [],
      username: '',
      email: props.session ? props.session.email : '',
      password: '',
      language: '',
      usernameValid: false,
      emailValid: false,
      passwordValid: false,
      languageValid: false,
      formValid: false,
      formEmpty: true,
      formReady: true,
    };
  }

  componentWillMount() {
    axios.get('http://localhost:8080/languages')
    .then((response) => {
      const languages = Array.from(response.data);
      this.setState({
        languages: languages,
      });
    })
    .catch((error) => {
      console.log('Couldn\'t get languages');
      this.setState({
        formReady: false,
      })
    })

    axios.get('http://localhost:8080/countries').then((response) => {
      const countries = Array.from(response.data);
      this.setState({
        countries: countries,
      });
    })
    .catch((error) => {
      console.log('Couldn\'t get countries');
      this.setState({
        formReady: false,
      })
    })
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
      formValid: this.state.usernameValid && this.state.emailValid && this.state.passwordValid && this.state.languageValid
    })
  }

  handleCreate(event) {
    event.preventDefault();
    const user = {
      username: event.target.username.value,
      email: event.target.email.value,
      password: event.target.password.value,
      country: event.target.country.value,
      language_id: parseInt(event.target.language.value),
    };
    this.props.onRegistration(event, user);
  }

  handleUpdate(event) {
    event.preventDefault();
    const user = {
      email: event.target.email.value,
      country: event.target.country.value,
      language_id: parseInt(event.target.language.value),
    };
    this.props.onUpdateUser(event, user);
  }

  handleCancel(event) {
    this.props.onCancel(event);
  }

  render() {
    const usernameClass = "input-group-lg" + (!this.state.usernameValid && !this.state.formEmpty ? " has-error" : "");

    const emailClass = (this.props.session ? "" : "input-group-lg") + (!this.state.emailValid && !this.state.formEmpty ? " has-error" : "");

    const passwordClass = (this.props.session ? "" : "input-group-lg") + (!this.state.passwordValid && !this.state.formEmpty ? " has-error" : "");

    const languageClass = (this.props.session ? "" : "input-group-lg") + (!this.state.languageValid && !this.state.formEmpty ? " has-error" : "");

    const countryClass = this.props.session ? "" : "input-group-lg";

    const languageOptions = this.state.languages.map(language => {
      if (this.props.session && language.id === this.props.session.language_id) {
          return <option selected key={language.id} value={language.id}>{language.native_name}</option>
      } else {
        return <option key={language.id} value={language.id}>{language.native_name}</option>
      }
    });

    const countryOptions = this.state.countries.map(country => {
      if (this.props.session && country.name === this.props.session.country) {
        return <option selected key={country.id} value={country.name}>{country.name}</option>
      } else {
        return <option key={country.id} value={country.name}>{country.name}</option>
      }
    });

    return (

      <div className="registration">
        { this.props.session ? '' : <h2>Sign Up</h2>}
        { this.props.errors && <div className="error">{this.props.errors}</div> }

        { !this.state.formReady && <div className="error">We are experiencing temporary technical difficulties. Please try again later</div> }

        <form className="user-form" onSubmit={this.props.session ? this.handleUpdate.bind(this) : this.handleCreate.bind(this) } >

          {this.props.session && <label>Update account information</label>}

          {!this.props.session &&
            <div className={usernameClass}>
            <input id="username" className="form-control" type="text" placeholder="Username" name="username" value={this.state.username} onChange={this.handleUserInput.bind(this)} />
            <div id="username-note" className="note">Username must be between 3 and 15 characters.</div>
            </div>
          }

          <div className={emailClass}>
            <input id="email" className="form-control" type="text" placeholder="Email" name="email" value={this.state.email} onChange={this.handleUserInput.bind(this)} />
            <div id="email-note" className="note">Please enter email in following format: name@gmail.com</div>
          </div>

          {!this.props.session &&
            <div className={passwordClass}>
              <input id="password" className="form-control" type="password" placeholder="Password" name="password" value={this.state.password} onChange={this.handleUserInput.bind(this)} />
              <div id="password-note" className="note">Select a 6-10 character password that begins with a letter and contains at least one number. Your password may not contain your email, word "password", or any blank spaces.</div>
            </div> }

          <div className={countryClass}>
            <select className="form-control" name="country">
              {this.props.session ? <option value="" disabled>Select Country</option> : <option value="" disabled selected>Select Country</option>}
              {countryOptions}
            </select>
          </div>

          <div className={languageClass}>
            <select className="form-control" name="language" onChange={this.handleUserInput.bind(this)}>
              {this.props.session ? <option value="" disabled>Select Language</option> : <option value="" disabled selected>Select Language</option>}
              {languageOptions}
            </select>
          </div>

          {!this.props.session &&
            <div className="input-group-lg">
            <button className="form-control orange-button" type="submit" disabled={!this.state.formValid || !this.state.formReady}>Create Account</button>
            </div>
          }

          {this.props.session &&
            <div>
              <button className="btn btn-default pull-right orange-button" onClick={this.handleCancel.bind(this)} type="button">Cancel</button>
              <button className="btn btn-default pull-right blue-button"  type="submit">Save</button>
            </div>
          }
        </form>
      </div>
    );
  }
}

export default Form;
