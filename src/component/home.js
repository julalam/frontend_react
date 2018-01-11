import React, { Component } from 'react';
import Login from './login';
import UserProfile from './user_profile';
import { Link } from 'react-router-dom'

class Home extends Component {
  render() {
    if (this.props.session) {
      return <UserProfile onLogout={this.props.onLogout} session={this.props.session} />
    } else {
      return (
        <div className="home">
          <h1>LOGO</h1>
          <Login onLogin={this.props.onLogin} errors={this.props.errors} />
          <Link to='/registration'>Create Account</Link>
        </div>
      )
    }
  }
}

export default Home;
