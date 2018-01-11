import React, { Component } from 'react';
import axios from 'axios';

class ContactList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      search: '',
    };
  }

  getContacts() {
    axios.get('http://localhost:8080/users?user=' + this.props.session.id).then((response) => {
      const contacts = response.data;
      this.setState({
        contacts: contacts,
      })
    });
  }

  componentDidMount() {
    this.getContacts();
  }

  handleClick(contact, event) {
    this.props.onContact(contact);
  }

  createRequest(user, event) {
    axios.post('http://localhost:8080/contacts', {
      from: this.props.session.id,
      to: user.id,
    }).then((response) => {
      console.log(`Sent request from ${this.props.session.username} to ${user.username}`);
      this.getContacts();
    });
  }

  acceptRequest(contact, event) {
    axios.patch('http://localhost:8080/contacts/' + contact.id, {
      status: 'accepted',
    }).then((response) => {
      console.log(`${this.props.session.username} accepted request`);
      this.getContacts();
    });
  }

  declineRequest(contact, event) {
    axios.patch('http://localhost:8080/contacts/' + contact.id, {
      status: 'declined',
    }).then((response) => {
      console.log(`${this.props.session.username} declined request`);
      this.getContacts();
    });
  }

  updateSearch(event) {
    const query = event.target.value.substr(0, 20);
    axios.get('http://localhost:8080/users?user=' + this.props.session.id + '&search=' + query).then((response) => {
      const contacts = response.data;
      this.setState({
        contacts: contacts,
      })
    });
    this.setState({
      search: query
    });
  }

  render() {
    const contacts = this.state.contacts.map(contact => {
      if (contact.status === 'sent_request') {
        return (
          <div key={contact.user.id}>
            {contact.user.username} (request already sent)
          </div>
        )
      } else if (contact.status === 'user') {
        return (
          <div key={contact.user.id}>
            {contact.user.username}
            <button onClick={this.createRequest.bind(this, contact.user)} type="button">Send Request</button>
          </div>
        )
      } else if (contact.status === 'received_request'){
        return (
          <div key={contact.user.id}>
            {contact.user.username}
            <button onClick={this.acceptRequest.bind(this, contact.contact)} type="button">Accept Request</button>
            <button onClick={this.declineRequest.bind(this, contact.contact)} type="button">Decline Request</button>
          </div>
        )
      } else {
        return (
          <div key={contact.user.id} onClick={this.handleClick.bind(this, contact.user)}>
          {contact.user.username}
          </div>
        )
      }
    });

    return (
      <div>
        <input type="text" placeholder='Search...' value={this.state.search} onChange={this.updateSearch.bind(this)} />

        <br/>
        <div>
          <strong>Contact List:</strong>
          {contacts}
        </div>
      </div>
    );
  }
}

export default ContactList;
