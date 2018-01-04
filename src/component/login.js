import React, { Component } from 'react';
import { Redirect } from 'react-router';
import UserProfile from './user_profile';
import Test from './test_component';
import axios from 'axios';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      username: '',
      session: '',
    };
  }

  handleSubmit(event) {
    event.preventDefault();

    if (event.target.username.value === '') {
      alert('please enter your username');
    } else {
      axios.post('http://localhost:8080/login', {
        username: event.target.username.value,
      }).then((response) => {
        this.setState({
          id: response.data.user.id,
          username: response.data.user.username,
          session: response.data.session,
        });
        console.log(`User ${this.state.username} logged in successfully`)
      });
    }
  }

  render() {
    if (this.state.id === this.state.session && this.state.session !== null) {
      return (
        <Redirect to={this.state.username} component={UserProfile} />
      )
    } else {
      return (
        <div className="login">
        <form onSubmit={this.handleSubmit.bind(this)}>
        <input type="text" placeholder="Username" name="username" />
        <button type="submit">Log In</button>
        </form>
        </div>
      );
    }
  }
}

export default Login;
