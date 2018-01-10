import React, { Component } from 'react';
import ContactList from './contact_list';
import MessageHistory from './message_history';
import cookie from 'react-cookies';

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contact: cookie.load('contact'),
    };
  }

  handleClick(event) {
    this.props.onLogout(event);
  }

  handleContact(contact) {
    this.setState({
      contact: contact,
    })
    if (this.state.contact) {
      cookie.remove('contact')
    }
    cookie.save('contact', this.state.contact)
  }

  render() {
    return (
      <div className="user-profile">
        <button onClick={this.handleClick.bind(this)} type="button">Log Out</button>
        <strong>{this.props.session.username}</strong>
        <div className="contact-list">
          <br/>
          <ContactList session={this.props.session}  onContact={this.handleContact.bind(this)}/>
        </div>
        <div className="message-history">
          <br/>
          <MessageHistory session={this.props.session} contact={this.state.contact} />
        </div>
      </div>
    );
  }
}

export default UserProfile;
