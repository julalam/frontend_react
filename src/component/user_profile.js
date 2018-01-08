import React, { Component } from 'react';
import ContactList from './contact_list';
import MessageHistory from './message_history';

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      session: this.props.session,
      contact: null,
    };
  }

  handleClick(event) {
    this.props.onLogout(event);
  }

  handleContact(contact) {
    this.setState({
      contact: contact,
    })
  }

  render() {
    return (
      <div className="user-profile">
        <button onClick={this.handleClick.bind(this)} type="button">Log Out</button>
        <strong>{this.state.session.username}</strong>
        <div className="contact-list">
          <ContactList session={this.state.session}  onContact={this.handleContact.bind(this)}/>
        </div>
        <div className="message-history">
          <MessageHistory session={this.state.session} contact={this.state.contact} />
        </div>
      </div>
    );
  }
}

export default UserProfile;
