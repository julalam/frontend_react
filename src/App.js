import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
// import { Redirect } from 'react-router';
import Test from './component/test_component';
import Home from './component/home';
import Registration from './component/registration';
import UserProfile from './component/user_profile';
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
    alert('in handleLogin');
    axios.post('http://localhost:8080/login', {
      username: event.target.username.value,
    }).then((response) => {
      this.setState({
        user: response.data.user,
        session: response.data.session,
      });
      console.log(`User ${this.state.username} logged in successfully`)
    });
  }

  render() {
    // if (this.state.user.id === this.state.session && this.state.session !== null) {
    //   return (
    //     <Redirect to={this.state.user.username} />
    //   )
    // } else {
      return (
        <div className="App">
          <Switch>
            <Route exact path='/' render = { () =>
              <Home onClick = {this.handleLogin.bind(this)} session={this.state.session} /> } />
            <Route path='/test' component={Test}/>
            <Route path='/registration' component={Registration}/>
            <Route path='/:username' component={UserProfile}/>
          </Switch>
        </div>
      );
    // }
  }
}

export default App;
