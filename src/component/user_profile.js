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
      contact_avatar: cookie.load('contact_avatar'),
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
      cookie.remove('contact_avatar')
    }
    this.setState({
      contact: contact.user,
      contact_avatar: contact.avatar,
    })
    cookie.save('contact', contact.user)
    cookie.save('contact_avatar', contact.avatar)
  }

  render() {
    return (
      <div className="row user-profile">
        <div className="col-lg-12 clearfix">
          <div className="col-lg-3">
            <img className="logo-xs" src={require("../assets/logo-name.png")} alt="SpeakEasy logo" />
          </div>
          <div className="col-lg-6">
            <h2>Hi, {this.props.session.username}</h2>
          </div>
          <div className="col-lg-3 user-buttons">
            <button className="btn btn-default glyphicon glyphicon-log-out pull-right orange-button" onClick={this.handleLogOut.bind(this)} type="button"></button>
            <button className="btn btn-default glyphicon glyphicon-edit pull-right blue-button" onClick={this.handleUpdate.bind(this)} type="button"></button>
          </div>
        </div>

        <div className="contact-list col-lg-3">
          { this.state.update ? <UserInfo session={this.props.session} avatar={this.props.avatar} onCancel={this.handleCancel.bind(this)} /> : <ContactList session={this.props.session} onContact={this.handleContact.bind(this)} /> }
        </div>

        <div className="message-history-wrapper col-lg-6">
          <MessageHistory session={this.props.session} contact={this.state.contact} />
        </div>

        <div className="contact-profile col-lg-3">
          <ContactProfile contact={this.state.contact} avatar={this.state.contact_avatar} />
        </div>
      </div>
    );
  }
}

export default UserProfile;
