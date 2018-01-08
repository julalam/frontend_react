import React, { Component } from 'react';
import Login from './login';
import UserProfile from './user_profile';
import { Link } from 'react-router-dom'

class Home extends Component {
  render() {
    return this.props.session===null
    ? (
      <div className="home">
        <h1>LOGO</h1>
        <Login onLogin={this.props.onLogin} />
        <Link to='/registration'>Create Account</Link>
      </div>
    )
    : <UserProfile onLogout={this.props.onLogout} user={this.props.user}/>
  }
  // render() {
  //   return <UserProfile user={this.props.user}/>;
  // }
}

export default Home;
