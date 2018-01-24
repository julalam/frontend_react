import React, { Component } from 'react';
import axios from 'axios';
import dateFormat from 'dateformat';
import {ActionCable} from 'react-actioncable-provider';

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
    axios.get('https://speakeasy-rails.herokuapp.com/users?user=' + this.props.session.id).then((response) => {
      const contacts = response.data;
      this.setState({
        contacts: contacts,
      });
      const friend = this.state.contacts.find((contact) => {
        return contact.status==='friend';
      });
      if (!this.props.contact && friend) {
        this.props.onContact(friend);
      }
    });
  }

  componentDidMount() {
    this.getContacts();
  }

  handleClick(contact, event) {
    const newMessages = this.state.newMessages.slice();
    const index = newMessages.indexOf(contact.user.id);
    if (index > -1) {
      newMessages.splice(index, 1);
    }
    this.setState({
      newMessages: newMessages,
    });
    this.props.onContact(contact);
  }

  createRequest(user, event) {
    axios.post('https://speakeasy-rails.herokuapp.com/contacts', {
      from: this.props.session.id,
      to: user.id,
    }).then((response) => {
      console.log(`Sent request from ${this.props.session.username} to ${user.username}`);
    });
  }

  acceptRequest(contact, event) {
    axios.patch('https://speakeasy-rails.herokuapp.com/contacts/' + contact.id, {
      status: 'accepted',
    }).then((response) => {
      console.log(`${this.props.session.username} accepted request`);
    });
  }

  declineRequest(contact, event) {
    axios.delete('https://speakeasy-rails.herokuapp.com/contacts/' + contact.id).then((response) => {
      console.log(`${this.props.session.username} declined request`);
      this.getContacts();
    });
  }

  updateSearch(event) {
    const query = event.target.value.substr(0, 20);
    if (query === '') {
      this.getContacts();
    } else {
      axios.get('https://speakeasy-rails.herokuapp.com/search?user=' + this.props.session.id + '&query=' + query).then((response) => {
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
    if (this.props.contact && this.props.contact.user && message.from !== this.props.contact.user.id) {
      const newMessages = this.state.newMessages.slice();
      newMessages.push(message.from);
      this.setState({
        newMessages: newMessages,
      });
    }

    const contacts = this.state.contacts.slice();
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

  onContactUpdateViaCable(contact) {
    console.log('Contact received via Action Cable');
    const contacts = this.state.contacts.slice();
    for (let i = 0; i < contacts.length; i++) {
      if (contacts[i].user.id === contact.user.id) {
        contacts.splice(i, 1);
        break;
      }
    }
    contacts.unshift(contact);
    this.setState({
      contacts: contacts,
    });
  }

  onOnlineStateChange(object) {
    console.log('Online state change received via Action Cable');
    const contacts = this.state.contacts.slice();
    for (let i = 0; i < contacts.length; i++) {
      if (contacts[i].user.id === object.id) {
        contacts[i].user.state = object.state;
        break;
      }
    }

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
            <img className="img-circle pull-left clearfix" src={contact.avatar} alt="Avatar" />
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
              <button className="btn btn-default pull-right blue-button" onClick={this.createRequest.bind(this, contact.user)} type="button">Send friend request</button>
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
              <small>Request received on {date}</small>
              <button className="btn btn-default glyphicon glyphicon-remove pull-right orange-button" onClick={this.declineRequest.bind(this, contact.contact)} type="button"></button>
              <button className="btn btn-default glyphicon glyphicon-ok pull-right blue-button" onClick={this.acceptRequest.bind(this, contact.contact)} type="button"></button>
            </div>
          </div>
        )
      } else {
        const className = "contact clearfix" +  (this.props.contact && this.props.contact.user.id === contact.user.id ? " selected-contact" : "") +  (this.state.newMessages.includes(contact.user.id) ? " notification" : "");
        let date = '';
        let date_rails = '';
        contact.last_message ? date_rails = dateFormat(contact.last_message.created_at).slice(0,10) : date_rails = '';
        const date_today = dateFormat(new Date()).slice(0,10);
        !contact.last_message ? date = '' : date_rails === date_today ? date = dateFormat(contact.last_message.created_at, 'h:MM') :  date = dateFormat(contact.last_message.created_at, 'mmm dS')
        return (
          <div className={className} key={contact.user.id} onClick={this.handleClick.bind(this, contact)}>
            <img className="img-circle pull-left clearfix" src={contact.avatar} alt="Avatar" />
            <div className="contact-text">
              <strong>{contact.user.username}</strong>
              <div className={contact.user.state}></div>
              <br/>
               <small>{!contact.last_message  ? '' : contact.last_message.from === this.props.session.id ? 'You: ' + contact.last_message.text : contact.last_message.message ? contact.user.username + ': ' + contact.last_message.message : contact.last_message.text }</small>
               <small className="pull-right">{date}</small>
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
        <ActionCable channel={{channel: 'ContactsChannel', id: this.props.session.id}} onReceived={this.onContactUpdateViaCable.bind(this)} />
        <ActionCable channel={{channel: 'OnlineStateChannel', id: this.props.session.id}} onReceived={this.onOnlineStateChange.bind(this)} />
          {contacts}
        </div>
      </div>
    );
  }
}

export default ContactList;
