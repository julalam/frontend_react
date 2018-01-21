import React, { Component } from 'react';

class ContactProfile extends Component {
  render() {
    if (!this.props.contact) {
      return <div className="user-info">...</div>
    }
    return (
      <div className="user-info">
        <img className="img-thumbnail avatar" src={this.props.avatar} alt="Avatar" />

        <p><strong>Username: </strong>{this.props.contact.username}</p>
        <p><strong>Country: </strong>{this.props.contact.country}</p>
        <p><strong>Language: </strong>{this.props.contact.language}</p>

      </div>
    );
  }
}

export default ContactProfile;
