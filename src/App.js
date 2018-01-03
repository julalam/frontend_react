import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Test from './component/test_component';
import Home from './component/home';
import Registration from './component/registration';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route path='/test' component={Test}/>
          <Route path='/registration' component={Registration}/>
        </Switch>
      </div>
    );
  }
}

export default App;
