import React, { Component } from 'react';
import axios from 'axios';

class ContactList extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
  }

  handleClick(contact, event) {
    this.props.onContact(contact);
  }

  render() {
    const contacts = this.state.contacts.map(contact => {
      return <div onClick={this.handleClick.bind(this, contact)} key={contact.id}>{contact.username}</div>
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
