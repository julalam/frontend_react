import React, { Component } from 'react';
import ContactList from './contact_list';
import MessageHistory from './message_history';

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
        <strong>{this.props.session.username}</strong>
        <div className="contact-list">
          <ContactList session={this.props.session}  onContact={this.handleContact.bind(this)}/>
        </div>
        <div className="message-history">
          <MessageHistory session={this.props.session} contact={this.props.contact} />
        </div>
      </div>
    );
  }
}

export default UserProfile;
