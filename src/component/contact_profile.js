import React, { Component } from 'react';

class ContactProfile extends Component {
  render() {
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
