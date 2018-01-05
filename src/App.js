import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Test from './component/test_component';
import Home from './component/home';
import Registration from './component/registration';
import UserProfile from './component/user_profile';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      session: null,
    };
  }

  handleLogin(username) {
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

  // setLoginUser(userData) {
  //
  // }

  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route path='/test' component={Test}/>
          <Route path='/registration' component={Registration}/>
          <Route path='/:username' component={UserProfile}/>
        </Switch>
      </div>
    );
  }
}

export default App;
