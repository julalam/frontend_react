import React, { Component } from 'react';

class ContactProfile extends Component {
  render() {
    if (!this.props.contact) {
      return <div>Please select contact...</div>
    }
    return (
      <div>
        <strong>Contact Profile: user {this.props.contact.username}</strong>
        <br/>
        <strong>Language: </strong> "User's Language"
      </div>
    );
  }
}

export default ContactProfile;
