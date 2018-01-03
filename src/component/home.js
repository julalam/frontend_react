import React, { Component } from 'react';
import Login from './login';
import { Link } from 'react-router-dom'

class Home extends Component {
  render() {
    return (
      <div className="home">
        <h1>LOGO</h1>
        <Login />
        <Link to='/registration'>Create account</Link>
      </div>
    );
  }
}

export default Home;
