import React, { Component } from 'react';
import { Redirect } from 'react-router';
import Form from './form';
import Footer from './footer';


class Registration extends Component {

  render() {
    if (this.props.session) {
      return (
        <Redirect to='/' />
      )
    } else {
      return (
        <div className="row">
            <img className="logo-sm" src={require("../assets/logo-name-circle.png")} alt="SpeakEasy logo" />

            <Form onRegistration={this.props.onRegistration} errors={this.props.errors} closeReport={this.props.closeReport}/>
          <Footer />
        </div>
      );
    }
  }
}

export default Registration;
