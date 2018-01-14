import React, { Component } from 'react';
import Login from './login';
import UserProfile from './user_profile';
import Footer from './footer';
import { Link } from 'react-router-dom'

class Home extends Component {
  render() {
    if (this.props.session) {
      return <UserProfile onLogout={this.props.onLogout} session={this.props.session} />
    } else {
      return (
        <div className="row">
          <div className="login">
            <img className="logo" src="http://via.placeholder.com/150x150" />
            <h1 className="logo">NAME</h1>
            <Login onLogin={this.props.onLogin} errors={this.props.errors} />
            <div className="input-group-lg">
              <Link className="form-control text-center" to='/registration'>Create Account</Link>
            </div>
          </div>
          <Footer />
        </div>
      )
    }
  }
}

export default Home;
