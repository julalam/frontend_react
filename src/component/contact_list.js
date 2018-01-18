import React, { Component } from 'react';
import {ActionCable} from 'react-actioncable-provider'
import axios from 'axios';
import dateFormat from 'dateformat';

class ContactList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      newMessages: [],
      query: '',
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
    const newMessages = this.state.newMessages.slice();
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
    axios.delete('http://localhost:8080/contacts/' + contact.id).then((response) => {
      console.log(`${this.props.session.username} declined request`);
      this.getContacts();
    });
  }

  updateSearch(event) {
    const query = event.target.value.substr(0, 20);
    if (query === '') {
      this.getContacts();
    } else {
      axios.get('http://localhost:8080/search?user=' + this.props.session.id + '&query=' + query).then((response) => {
        const contacts = response.data;
        this.setState({
          contacts: contacts,
        })
      });
    }
    this.setState({
      query: query,
    });
  }

  onMessage(message) {
    console.log('Message received by contact list');
    const newMessages = this.state.newMessages.slice();
    newMessages.push(message.from);
    this.setState({
      newMessages: newMessages,
    });

    const contacts = this.state.contacts;
    for (let i = 0; i < contacts.length; i++) {
      if (contacts[i].user.id === message.to || contacts[i].user.id === message.from) {
        contacts[i].last_message = message;
        break;
      }
    }
    this.setState({
        contacts: contacts,
    });
  }

  onContact(contact) {
    console.log('Contact received');
    const contacts = this.state.contacts;
    for (let i = 0; i < contacts.length; i++) {
      if (contacts[i].user.id === contact.user.id) {
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
        const date = dateFormat(contact.contact.created_at).slice(0,-3);
        return (
          <div className="contact clearfix" key={contact.user.id}>
            <img className="img-circle pull-left" src={contact.avatar} alt="Avatar" />
            <div className="contact-text">
              <strong>{contact.user.username}</strong>
              <br/>
              <small>Request sent on {date}</small>
            </div>
          </div>
        )
      } else if (contact.status === 'user') {
        return (
          <div className="contact clearfix" key={contact.user.id}>
            <img className="img-circle pull-left clearfix" src={contact.avatar} alt="Avatar" />
            <div className="contact-text">
              <strong>{contact.user.username}</strong>
              <button className="btn btn-default pull-right" onClick={this.createRequest.bind(this, contact.user)} type="button">Send friend request</button>
            </div>
          </div>
        )
      } else if (contact.status === 'received_request'){
        const date = dateFormat(contact.contact.created_at).slice(0,-3);
        return (
          <div className="contact clearfix" key={contact.user.id}>
            <img className="img-circle pull-left clearfix" src={contact.avatar} alt="Avatar" />
            <div className="contact-text">
              <strong>{contact.user.username}</strong>
              <br/>
              <small>Request sent on {date}</small>
              <button className="btn btn-default glyphicon glyphicon-remove pull-right" onClick={this.declineRequest.bind(this, contact.contact)} type="button"></button>
              <button className="btn btn-default glyphicon glyphicon-ok pull-right" onClick={this.acceptRequest.bind(this, contact.contact)} type="button"></button>
            </div>
          </div>
        )
      } else {
        const className = "contact clearfix" +  (this.state.newMessages.includes(contact.user.id) ? " notification" : "");
        return (
          <div className={className} key={contact.user.id} onClick={this.handleClick.bind(this, contact)}>
            <img className="img-circle pull-left" src={contact.avatar} alt="Avatar" />
            <div className="contact-text">
              <strong>{contact.user.username}</strong>
              <br/>
              {contact.last_message  ? contact.last_message.text : ''}
            </div>
          </div>
        )
      }
    });

    return (
      <div>
        <div className="input-group">
          <div className="input-group-addon"><span className="glyphicon glyphicon-search"></span></div>
          <input className="form-control" type="text" placeholder='Search SpeakEasy...' value={this.state.query} onChange={this.updateSearch.bind(this)} />
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
