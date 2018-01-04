import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Test from './component/test_component';
import Home from './component/home';
import Registration from './component/registration';
import UserProfile from './component/user_profile';
import './App.css';

class App extends Component {
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
          <Route path='/:username' render={()=><UserProfile setLoginUser="test test" />} />
        </Switch>
      </div>
    );
  }
}

export default App;
