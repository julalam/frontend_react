import React, { Component } from 'react';
import Login from './login';
import { Link } from 'react-router-dom'

class Home extends Component {
  render() {
    return (
      <div className="home">
        <h1>LOGO</h1>
        <Login onLogin={() => this.props.onLogin(username)}/>
        <Link to='/registration'>Create Account</Link>
      </div>
    );
  }
}

export default Home;
