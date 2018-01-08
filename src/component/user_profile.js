import React, { Component } from 'react';
import ContactList from './contact_list';
import MessageHistory from './message_history';

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      session: this.props.session,
    };
  }

  handleClick(event) {
    this.props.onLogout(event);
  }

  render() {
    return (
      <div className="user-profile">
        <button onClick={this.handleClick.bind(this)} type="button">Log Out</button>
        <strong>{this.state.session.username}</strong>
        <div className="contact-list">
          <ContactList user={this.state.session} />
        </div>
        <div className="message-history">
          <MessageHistory user={this.state.session} />
        </div>
      </div>
    );
  }
}

export default UserProfile;
