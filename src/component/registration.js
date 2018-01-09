import React, { Component } from 'react';
import { Redirect } from 'react-router';
import axios from 'axios';


class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      languages: [],
    };
  }

  componentWillMount() {
    axios.get('http://localhost:8080/languages').then((response) => {
      console.log(response);
      const languages = Array.from(response.data);
      this.setState({
        languages: languages,
      });
    });
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
    console.log(this.state.languages);
    const languageOptions = this.state.languages.map(language => {
      return <option key={language.code} value={language.name}>{language.native_name}</option>
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
            <select name="language">{languageOptions}</select>
            <button type="submit">Create Account</button>
          </form>
        </div>
      );
    }
  }
}

export default Registration;
