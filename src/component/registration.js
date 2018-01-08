import React, { Component } from 'react';
import { Redirect } from 'react-router';
import UserProfile from './user_profile';
import axios from 'axios'

class Registration extends Component {
  static defaultProps = {
    languages: ['ru', 'en', 'es']
  }

  handleSubmit(event) {
    event.preventDefault();
    const user = {
      username: event.target.username.value,
      language: event.target.language.value,
    };
    this.props.onRegistration(event, user);
  }

  render() {
    const languageOptions = this.props.languages.map(language => {
      return <option key={language} value={language}>{language}</option>
    });

    if (this.props.user.id === this.props.session && this.props.session !== null) {
      return (
        <Redirect to='/' />
      )
    } else {
      return (
        <div className="registration">
          <h1>Create a New Account</h1>

          <form onSubmit={this.handleSubmit.bind(this)}>
            <input type="text" placeholder="Username" name="username" />
            <select name="language">{languageOptions}</select>
            <button type="submit">Create Account</button>
          </form>
        </div>
      );
    }
  }
}

export default Registration;
