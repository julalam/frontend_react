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
      language: cookie.load('language'),
      loginErrors: '',
      registrationErrors: '',
      imageErrors: '',
      imageSuccess: '',
      infoErrors: '',
      infoSuccess: '',
    };
  }

  handleLogin(event, data) {
    axios.post('https://speakeasy-rails.herokuapp.com/login', {data})
    .then((response) => {
      if (response.data.session) {
        this.setState({
          session: response.data.session,
          avatar: response.data.avatar,
          language: response.data.language,
        });
        cookie.save('session', this.state.session)
        cookie.save('avatar', this.state.avatar)
        cookie.save('language', this.state.language)
        console.log(`User ${this.state.session.username} logged in successfully`);
      } else if (response.data.user === null) {
        console.log('Username does\'n match');
        this.setState({
          loginErrors: 'We do not recognize that username and password combination'
        })
      }
    })
    .catch((error) => {
      console.log('User couldn\'t log in');
      this.setState({
        loginErrors: 'Something went wrong. Please try again later',
      })
    });
  }

  handleLogout(event) {
    axios.post('https://speakeasy-rails.herokuapp.com/logout?user=' + this.state.session.id)
    .then((response) => {
      this.setState({
        session: response.data.session,
        avatar: response.data.avatar,
        language: response.data.language,
        errors: '',
      });
      if (!this.state.session || !this.state.avatar || !this.state.language) {
        cookie.remove('session')
        cookie.remove('avatar')
        cookie.remove('language')
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
    axios.post('https://speakeasy-rails.herokuapp.com/users', {
      username: user.username,
      email: user.email,
      password: user.password,
      country: user.country,
      language_id: user.language_id,
    })
    .then((response) => {
      this.setState({
        session: response.data.session,
        avatar: response.data.avatar,
        language: response.data.language,
      });
      cookie.save('session', this.state.session)
      cookie.save('avatar', this.state.avatar)
      cookie.save('language', this.state.language)
      console.log(`User ${this.state.session.username} successfully created new account`)
    })
    .catch((error) => {
      console.log('New account wasn\'t created');
      this.setState({
        registrationErrors: 'Something went wrong. Please try again later',
      })
    })
  }

  handleUpdateUser(event, user) {
    axios.patch('https://speakeasy-rails.herokuapp.com/users/' + this.state.session.id, {
      email: user.email,
      country: user.country,
      language_id: user.language_id,
    })
    .then((response) => {
      this.setState({
        session: response.data.user,
        language: response.data.language,
        infoSuccess: 'Account information has been updated',
      })
      cookie.remove('session');
      cookie.remove('language');
      cookie.save('session', this.state.session);
      cookie.save('language', this.state.language);
    })
    .catch((error) => {
      console.log('Accunt information wasn\'t updated');
      this.setState({
        infoErrors: 'Something went wrong. Please try again later',
      })
    })
  }

  handleUpdateImage(event, file) {
    console.log('in image update');
    let formData = new FormData();
    formData.append('avatar', file);
    axios.patch('https://speakeasy-rails.herokuapp.com/users/' + this.state.session.id, formData, { headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then((response) => {
      this.setState({
        avatar: response.data.avatar,
        imageSuccess: 'Account avatar has been updated',
      })
      cookie.remove('avatar');
      cookie.save('avatar', this.state.avatar);
    })
    .catch((error) => {
      console.log('Accunt avatar wasn\'t updates');
      this.setState({
        imageErrors: 'Something went wrong. Please try again later',
      })
    })
  }

  closeReport(target, event) {
    this.setState({
      [target]: '',
    })
  }

  render() {
    return (
      <div className="container-fluid">
        <Switch>
          <Route exact path='/' render = { () =>
            <Home onLogin={this.handleLogin.bind(this)} onLogout={this.handleLogout.bind(this)} session={this.state.session} avatar={this.state.avatar} language={this.state.language} loginErrors={this.state.loginErrors} infoErrors={this.state.infoErrors} imageErrors={this.state.imageErrors} infoSuccess={this.state.infoSuccess} imageSuccess={this.state.imageSuccess}
            onUpdateUser={this.handleUpdateUser.bind(this)} onImageUpdate={this.handleUpdateImage.bind(this)}
            closeReport={this.closeReport.bind(this)} /> } />
          <Route path='/registration' render = { () => <Registration onRegistration={this.handleRegistration.bind(this)} session={this.state.session} errors={this.state.registrationErrors} closeReport={this.closeReport.bind(this)} /> } />
        </Switch>
      </div>
    );
  }
}

export default App;
