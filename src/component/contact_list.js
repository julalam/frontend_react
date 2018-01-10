import React, { Component } from 'react';
import axios from 'axios';

class ContactList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      requests: [],
      contacts: [],
    };
  }

  componentDidMount() {
    axios.get('http://localhost:8080/users').then((response) => {
      const users = Array.from(response.data);
      this.setState({
        users: users,
      })
    });

    axios.get('http://localhost:8080/contacts?from=' + this.props.session.id).then((response) => {
      const requests = Array.from(response.data.requests);
      const contacts = Array.from(response.data.contacts);
      this.setState({
        requests: requests,
        contacts: contacts,
      })
    });
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
    });
  }

  acceptRequest(contact, event) {
    axios.patch('http://localhost:8080/contacts/' + contact.id, {
      status: 'accepted',
    }).then((response) => {
      console.log(`${this.props.session.username} accepted request`);
    });
  }

  declineRequest(contact, event) {
    axios.patch('http://localhost:8080/contacts/' + contact.id, {
      status: 'declined',
    }).then((response) => {
      console.log(`${this.props.session.username} declined request`);
    });
  }

  render() {
    const users = this.state.users.map(user => {
      return (
        <div key={user.id}>
          <div>{user.username}</div>
          <button onClick={this.createRequest.bind(this, user)} type="button">Send Request</button>
        </div>
      )
    });

    const requests = this.state.requests.map(contact => {
      return (
        <div key={contact.sender.id}>
          <div>{contact.sender.username}</div>
          <button onClick={this.acceptRequest.bind(this, contact.contact)} type="button">Accept Request</button>
          <button onClick={this.declineRequest.bind(this, contact.contact)} type="button">Decline Request</button>
        </div>
      )
    });

    const contacts = this.state.contacts.map(contact => {
      return (
        <div key={contact.sender.id}>
          <div onClick={this.handleClick.bind(this, contact.sender)}>{contact.sender.username}</div>
        </div>
      )
    });

    return (
      <div>
        <div>
          <strong>All Users:</strong>
          {users}
        </div>
        <div>
          <strong>All Pending Requests:</strong>
          {requests}
        </div>
        <div>
          <strong>Contact List:</strong>
          {contacts}
        </div>
      </div>
    );
  }
}

export default ContactList;
