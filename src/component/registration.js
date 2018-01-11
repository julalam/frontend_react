import React, { Component } from 'react';
import { Redirect } from 'react-router';
import axios from 'axios';


class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      languages: [],
      countries: [],
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
        <div className="registration">
          <h1>Create a New Account</h1>

          <form onSubmit={this.handleSubmit.bind(this)}>
            <input type="text" placeholder="Username" name="username" />
            <br/>
            <input type="text" placeholder="Email" name="email" />
            <br/>
            <input type="password" placeholder="Password" name="password" />
            <br/>
            <select name="country">
              <option value="" disabled selected>Select Country</option>
              {countryOptions}
            </select>
            <select name="language">
              <option value="" disabled selected>Select Language</option>
              {languageOptions}
            </select>

            <button type="submit">Create Account</button>
          </form>
        </div>
      );
    }
  }
}

export default Registration;
