import React, { Component } from 'react';
import Test from './component/test_component'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>My App</h1>
        <Test />
      </div>
    );
  }
}

export default App;
