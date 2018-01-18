import React, { Component } from 'react';
import ContactList from './contact_list';
import MessageHistory from './message_history';
import ContactProfile from './contact_profile';
import UserInfo from './user_info';
import cookie from 'react-cookies';

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contact: cookie.load('contact'),
      update: false,
    };
  }

  handleLogOut(event) {
    this.props.onLogout(event);
  }

  handleUpdate(event) {
    this.setState({
      update: true,
    })
  }

  handleCancel(event) {
    this.setState({
      update: false,
    })
  }

  handleContact(contact) {
    if (this.state.contact) {
      cookie.remove('contact')
    }
    this.setState({
      contact: contact,
    })
    cookie.save('contact', contact)
  }

  render() {
    return (
      <div className="row user-profile">
        <div className="col-lg-12">
          <img className="logo-xs" src={require("../assets/logo-sm.png")} alt="SpeakEasy logo" />
          <button className="pull-right" onClick={this.handleUpdate.bind(this)} type="button">Edit Profile</button>
          <button className="pull-right" onClick={this.handleLogOut.bind(this)} type="button">Log Out</button>
          <strong>Hi, {this.props.session.username}</strong>
        </div>

        <div className="contact-list col-lg-3">
          { this.state.update ? <UserInfo session={this.props.session} avatar={this.props.avatar} onCancel={this.handleCancel.bind(this)} /> : <ContactList session={this.props.session} onContact={this.handleContact.bind(this)} /> }
        </div>

        <div className="message-history-wrapper col-lg-6">
          <MessageHistory session={this.props.session} contact={this.state.contact} />
        </div>

        <div className="contact-profile col-lg-3">
          <ContactProfile contact={this.state.contact} />
        </div>
      </div>
    );
  }
}

export default UserProfile;
