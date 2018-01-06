import React, { Component } from 'react';
import ContactList from './contact_list';
import MessageHistory from './message_history';
// import axios from 'axios';

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      session: this.props.session,
    };
  }

  render() {
    return (
      <div className="user-profile">
        <strong>{this.state.user.username}</strong>
        <div className="contact-list">
          <ContactList user={this.state.user} />
        </div>
        <div className="message-history">
          <MessageHistory user={this.state.user} />
        </div>
      </div>
    );
  }
}

export default UserProfile;
