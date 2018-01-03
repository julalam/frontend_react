import React, { Component } from 'react';
import Login from './login';
import Register from './register';

class Home extends Component {
  render() {
    return (
      <div className="home">
        <h1>LOGO</h1>
        <Login />
        <Register />
      </div>
    );
  }
}

export default Home;
