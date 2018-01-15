import React, { Component } from 'react';
import ContactList from './contact_list';
import MessageHistory from './message_history';
import ContactProfile from './contact_profile';
import cookie from 'react-cookies';

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //contact: null,
      contact: cookie.load('contact'),
    };
  }

  handleClick(event) {
    this.props.onLogout(event);
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
          <button onClick={this.handleClick.bind(this)} type="button">Log Out</button>
          <strong>{this.props.session.username}</strong>
        </div>

        <div className="contact-list col-lg-3">
          <ContactList session={this.props.session}  onContact={this.handleContact.bind(this)}/>
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
