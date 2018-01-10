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
      session: cookie.load('session')
    };
  }

  handleLogin(event, username) {
    axios.post('http://localhost:8080/login', {username}).then((response) => {
      this.setState({
        session: response.data.session,
      });
      cookie.save('session', this.state.session)
      console.log(`User ${this.state.session.username} logged in successfully`);
    });
  }

  handleLogout(event) {
    axios.post('http://localhost:8080/logout').then((response) => {
      this.setState({
        session: response.data.session,
      });
      if (!this.state.session) {
        cookie.remove('session')
        cookie.remove('contact')
        console.log(`User logged out successfully`);
      }
    });
  }

  handleRegistration(event, user) {
    if (user.username === '') {
      alert('username is required');
    } else {
      axios.post('http://localhost:8080/users', {
        username: user.username,
        language: user.language,
      }).then((response) => {
        this.setState({
          session: response.data.session,
        });
        cookie.save('session', this.state.session)
        console.log(`User ${this.state.session.username} successfully created new account`)
      })
    }
  }

  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path='/' render = { () =>
            <Home onLogin={this.handleLogin.bind(this)} onLogout={this.handleLogout.bind(this)} session={this.state.session} /> } />
          <Route path='/registration' render = { () => <Registration onRegistration={this.handleRegistration.bind(this)} session={this.state.session} /> } />
        </Switch>
      </div>
    );
  }
}

export default App;
