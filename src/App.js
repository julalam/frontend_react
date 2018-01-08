import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Test from './component/test_component';
import Home from './component/home';
import Registration from './component/registration';
import axios from 'axios';
import './App.css';



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      session: null,
    };
  }

  handleLogin(event, username) {
    axios.post('http://localhost:8080/login', {username}).then((response) => {
      this.setState({
        user: response.data.user,
        session: response.data.session,
      });
      console.log(`User ${this.state.username} logged in successfully`)
    });
  }

  handleLogout(event) {
    axios.post('http://localhost:8080/logout').then((response) => {
      this.setState({
        session: response.data.session,
      });
      if (this.state.session === null) {
        this.setState({
          user: null,
        })
      }
      console.log(`User logged out successfully`)
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
          user: response.data.user,
          session: response.data.session,
        });
        console.log(`User ${this.state.user.username} successfully created new account`)
      })
    }
  }

  render() {
      return (
        <div className="App">
          <Switch>
            <Route exact path='/' render = { () =>
              <Home onLogin={this.handleLogin.bind(this)} onLogout={this.handleLogout.bind(this)} session={this.state.session} user={this.state.user}/> } />
            <Route path='/test' component={Test}/>
            <Route path='/registration' render = { () => <Registration onRegistration={this.handleRegistration.bind(this)} session={this.state.session} user={this.state.user}/> } />
          </Switch>
        </div>
      );
  }
}

export default App;
