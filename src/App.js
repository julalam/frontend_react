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
      avatar: cookie.load('avatar'),
      errors: '',
    };
  }

  handleLogin(event, data) {
    axios.post('http://localhost:8080/login', {data})
    .then((response) => {
      if (response.data.session) {
        this.setState({
          session: response.data.session,
          avatar: response.data.avatar,
        });
        cookie.save('session', this.state.session)
        cookie.save('avatar', this.state.avatar)
        console.log(`User ${this.state.session.username} logged in successfully`);
      } else if (response.data.user === null) {
        console.log('Username does\'n match');
        this.setState({
          errors: 'We do not recognize that username and password combination'
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
    axios.post('http://localhost:8080/logout')
    .then((response) => {
      this.setState({
        session: response.data.session,
        avatar: response.data.avatar,
        errors: '',
      });
      if (!this.state.session || !this.state.avatar) {
        cookie.remove('session')
        cookie.remove('avatar')
        cookie.remove('contact')
        cookie.remove('contact_avatar')
        console.log(`User logged out successfully`);
      }
    })
    .catch((error) => {
      console.log('User couldn\'t log out');
    })
  }

  handleRegistration(event, user) {
    axios.post('http://localhost:8080/users', {
      username: user.username,
      email: user.email,
      password: user.password,
      country: user.country,
      language: user.language,
    })
    .then((response) => {
      this.setState({
        session: response.data.session,
        avatar: response.data.avatar,
      });
      cookie.save('session', this.state.session)
      cookie.save('avatar', this.state.avatar)
      console.log(`User ${this.state.session.username} successfully created new account`)
    })
    .catch((error) => {
      console.log('New account wasn\'t created');
      this.setState({
        errors: 'Something went wrong. Please try again later',
      })
    })
  }

  handleUpdateUser(event, user) {
    console.log('in handle update');
    axios.patch('http://localhost:8080/users/' + this.state.session.id, {
      email: user.email,
      country: user.country,
      language: user.language,
    })
    .then((response) => {
      this.setState({
        session: response.data.user,
      })
    })
  }

  render() {
    return (
      <div className="container-fluid">
        <Switch>
          <Route exact path='/' render = { () =>
            <Home onLogin={this.handleLogin.bind(this)} onLogout={this.handleLogout.bind(this)} session={this.state.session} avatar={this.state.avatar} errors={this.state.errors} onUpdateUser = {this.handleUpdateUser.bind(this)} /> } />
          <Route path='/registration' render = { () => <Registration onRegistration={this.handleRegistration.bind(this)} session={this.state.session} errors={this.state.errors} /> } />
        </Switch>
      </div>
    );
  }
}

export default App;
