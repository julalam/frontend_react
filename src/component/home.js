import React, { Component } from 'react';
import Login from './login';
import UserProfile from './user_profile';
import Footer from './footer';
import { Link } from 'react-router-dom'

class Home extends Component {
  render() {
    if (this.props.session) {
      return <UserProfile onLogout={this.props.onLogout} session={this.props.session} avatar={this.props.avatar} language={this.props.language} onUpdateUser={this.props.onUpdateUser} onImageUpdate={this.props.onImageUpdate}
      infoErrors={this.props.infoErrors} imageErrors={this.props.imageErrors} infoSuccess={this.props.infoSuccess} imageSuccess={this.props.imageSuccess}
      closeReport={this.props.closeReport} />
    } else {
      return (
        <div className="row">
          <div className="login">
            <img className="logo" src={require("../assets/login-logo.png")} alt="SpeakEasy Logo" />
            <Login onLogin={this.props.onLogin} errors={this.props.loginErrors} closeReport={this.props.closeReport} />
            <div className="input-group-lg">
              <Link className="form-control text-center orange-button" to='/registration'>Create Account</Link>
            </div>
          </div>
          <Footer />
        </div>
      )
    }
  }
}

export default Home;
