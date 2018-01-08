import React, { Component } from 'react';
import { Redirect } from 'react-router';
import UserProfile from './user_profile';
import axios from 'axios'

class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      username: '',
      language: '',
      session: null,
    };
  }

  static defaultProps = {
    languages: ['ru', 'en', 'es']
  }

  handleSubmit(event) {
    event.preventDefault();

    if (event.target.username.value === '') {
      alert('username is required');
    } else {
      axios.post('http://localhost:8080/users', {
        username: event.target.username.value,
        language: event.target.language.value,
      }).then((response) => {
        this.setState({
          id: response.data.user.id,
          username: response.data.user.username,
          language: response.data.user.language,
          session: response.data.session,
        });
        console.log(`User ${this.state.username} successfully created new account`)
      })
    }
  }

  render() {
    const languageOptions = this.props.languages.map(language => {
      return <option key={language} value={language}>{language}</option>
    });

    if (this.state.id === this.state.session && this.state.session !== null) {
      return (
        <Redirect to={this.state.username} component={UserProfile} />
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