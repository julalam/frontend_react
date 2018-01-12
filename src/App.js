import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './component/home';
import Registration from './component/registration';
import axios from 'axios';
import './App.css';
import cookie from 'react-cookies';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      session: cookie.load('session'),
      errors: '',
    };
  }

  handleLogin(event, username) {
    axios.post('http://localhost:8080/login', {username})
    .then((response) => {
      if (response.data.session) {
        this.setState({
          session: response.data.session,
        });
        cookie.save('session', this.state.session)
        console.log(`User ${this.state.session.username} logged in successfully`);
      } else if (response.data.user === null) {
        console.log('Username does\'n match');
        this.setState({
          errors: 'The username you\'ve entered doesn\'t match any account.'
        })
      }
    })
    .catch((error) => {
      console.log('User couldn\'t log in');
      this.setState({
        errors: 'Something went wrong. Please try again later',
      })
    });
  }

  handleLogout(event) {
    axios.post('http://localhost:8080/logout').then((response) => {
      this.setState({
        session: response.data.session,
        errors: '',
      });
      if (!this.state.session) {
        cookie.remove('session')
        cookie.remove('contact')
        console.log(`User logged out successfully`);
      }
    });
  }

  handleRegistration(event, user) {
    axios.post('http://localhost:8080/users', {
      username: user.username,
      email: user.email,
      password: user.password,
      country: user.country,
      language: user.language,
    }).then((response) => {
      this.setState({
        session: response.data.session,
      });
      cookie.save('session', this.state.session)
      console.log(`User ${this.state.session.username} successfully created new account`)
    })
  }

  render() {
    return (
      <div className=" container-fluid app">
        <Switch>
          <Route exact path='/' render = { () =>
            <Home onLogin={this.handleLogin.bind(this)} onLogout={this.handleLogout.bind(this)} session={this.state.session} errors={this.state.errors} /> } />
          <Route path='/registration' render = { () => <Registration onRegistration={this.handleRegistration.bind(this)} session={this.state.session} /> } />
        </Switch>
      </div>
    );
  }
}

export default App;
