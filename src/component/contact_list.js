import React, { Component } from 'react';
// import ContactList from './contact_list';
// import { Redirect } from 'react-router';
import axios from 'axios';

class ContactList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      username: '',
      session: null,
      contacts: [],
    };
  }

  componentDidMount() {
    axios.get('http://localhost:8080/users').then((response) => {
      const contacts = Array.from(response.data);
      this.setState({
        contacts: contacts,
      })
    });
  };

  render() {
    const contacts = this.state.contacts.map(contact => {
      return <div key={contact.id}>{contact.username}</div>
    });

    return (
      <div>
        <strong>Contact List:</strong>
        {contacts}
      </div>
    );
  }
}

export default ContactList;
