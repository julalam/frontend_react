import React, { Component } from 'react';
import {ActionCable} from 'react-actioncable-provider'
import axios from 'axios';

class ContactList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      newMessages: [],
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
    const newMessages = this.state.newMessages;
    const index = newMessages.indexOf(contact.id);
    if (index > -1) {
      newMessages.splice(index, 1);
    }
    this.setState({
      newMessages: newMessages,
    })
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
    axios.delete('http://localhost:8080/contacts/' + contact.id).then((response) => {
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

  onMessage(message) {
    console.log('Message received by contact list');
    const newMessages = this.state.newMessages;
    newMessages.push(message.from);
    this.setState({
      newMessages: newMessages,
    });
  }

  onContact(contact) {
    console.log('Contact received');
    const contacts = this.state.contacts;
    for (let i = 0; i < contacts.length; i++)
    {
      if (contacts[i].user.id == contact.user.id)
      {
        contacts.splice(i, 1);
        break;
      }
    }
    contacts.push(contact);
    this.setState({
      contacts: contacts,
    });
  }

  render() {
    const contacts = this.state.contacts.map(contact => {
      if (contact.status === 'sent_request') {
        return (
          <div className="contact" key={contact.user.id}>
            <strong>{contact.user.username}</strong> (request already sent)
          </div>
        )
      } else if (contact.status === 'user') {
        return (
          <div className="contact" key={contact.user.id}>
            <strong>{contact.user.username}</strong>
            <button onClick={this.createRequest.bind(this, contact.user)} type="button">Send Request</button>
          </div>
        )
      } else if (contact.status === 'received_request'){
        return (
          <div className="contact" key={contact.user.id}>
            <strong>{contact.user.username}</strong>
            <button onClick={this.acceptRequest.bind(this, contact.contact)} type="button">Accept Request</button>
            <button onClick={this.declineRequest.bind(this, contact.contact)} type="button">Decline Request</button>
          </div>
        )
      } else {
        console.log(contact.user);
        const className = "contact" +  (this.state.newMessages.includes(contact.user.id) ? " notification" : "");
        return (
          <div className={className} key={contact.user.id} onClick={this.handleClick.bind(this, contact.user)}>
          <strong>{contact.user.username}</strong>
          </div>
        )
      }
    });

    return (
      <div>
        <div className="input-group">
          <div className="input-group-addon"><span className="glyphicon glyphicon-search"></span></div>
          <input className="form-control" type="text" placeholder='Search SpeakEasy...' value={this.state.search} onChange={this.updateSearch.bind(this)} />
        </div>

        <div>
        <ActionCable ref='cable3' channel={{channel: 'MessagesChannel', id: this.props.session.id}} onReceived={this.onMessage.bind(this)} />

        <ActionCable ref='cable2' channel={{channel: 'ContactsChannel', id: this.props.session.id}} onReceived={this.onContact.bind(this)} />
          {contacts}
        </div>
      </div>
    );
  }
}

export default ContactList;
