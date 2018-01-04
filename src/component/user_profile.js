import React, { Component } from 'react';
import ContactList from './contact_list';
// import { Redirect } from 'react-router';
// import axios from 'axios';

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 3,
      username: 'Julia',
      language: 'ru',
      session: 3,
    };
  }

  render() {
    return (
      <div className="user-profile">
      {this.props.setLoginUser}
        <div className="contact-list">
          <ContactList />
        </div>
        <div className="history">
        </div>
      </div>
    );
  }
}

export default UserProfile;
