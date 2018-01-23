import React, { Component } from 'react';
import dateFormat from 'dateformat';

class ContactProfile extends Component {
  render() {
    const date = dateFormat(this.props.contact.user.created_at, 'mmmm yyyy');
    if (!this.props.contact) {
      return <div className="user-info">...</div>
    }
    return (
      <div className="user-info">
        <img className="img-thumbnail avatar" src={this.props.contact.avatar} alt="Avatar" />
        <p className={this.props.contact.user.state}>{this.props.contact.user.state}</p>
        <p><span className="glyphicon glyphicon-user"></span>Username: {this.props.contact.user.username}</p>
        <p><span className="glyphicon glyphicon-map-marker"></span>From: {this.props.contact.user.country}</p>
        <p><span className="glyphicon glyphicon-globe"></span>Language: {this.props.contact.language}</p>
        <p><span className="glyphicon glyphicon-time"></span>Joined: {date}</p>

      </div>
    );
  }
}

export default ContactProfile;
