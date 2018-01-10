import React, { Component } from 'react';
import axios from 'axios';

class ContactList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: {
        sentRequests: [],
        receivedRequests: [],
        friends: [],
        moreUsers: [],
      },
      requests: [],
      contacts: [],
      search: '',
    };
  }

  getUsersAndContacts() {
    axios.get('http://localhost:8080/users?user=' + this.props.session.id).then((response) => {
      const users = response.data;
      this.setState({
        users: {
          sentRequests: users.sent_requests,
          receivedRequests: users.received_requests,
          friends: users.contact_list,
          moreUsers: users.more_users,
        }
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

  componentDidMount() {
    this.getUsersAndContacts();
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
      this.getUsersAndContacts();
    });
  }

  acceptRequest(contact, event) {
    axios.patch('http://localhost:8080/contacts/' + contact.id, {
      status: 'accepted',
    }).then((response) => {
      console.log(`${this.props.session.username} accepted request`);
      this.getUsersAndContacts();
    });
  }

  declineRequest(contact, event) {
    axios.patch('http://localhost:8080/contacts/' + contact.id, {
      status: 'declined',
    }).then((response) => {
      console.log(`${this.props.session.username} declined request`);
      this.getUsersAndContacts();
    });
  }

  updateSearch(event) {
    this.setState({
      search: event.target.value.substr(0, 20)
    });
  }

  render() {
    const filteredMoreUsers = this.state.users.moreUsers.filter((user) => {
      return user.username.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
    });

    const filteredSentRequests = this.state.users.sentRequests.filter((user) => {
      return user.username.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
    });

    const filteredReceivedRequests = this.state.users.sentRequests.filter((user) => {
      return user.username.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
    });

    const filteredFriends = this.state.users.sentRequests.filter((user) => {
      return user.username.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
    });

    const moreUsers = filteredMoreUsers.map(user => {
      return (
        <div key={user.id}>
          <div>{user.username}</div>
          <button onClick={this.createRequest.bind(this, user)} type="button">Send Request</button>
        </div>
      )
    });

    const sentRequests = filteredSentRequests.map(user => {
      return (
        <div key={user.id}>
          <div>{user.username} Request sent</div>
        </div>
      )
    });

    const receivedRequests = filteredReceivedRequests.map(user => {
      return (
        <div key={user.id}>
          <div>{user.username} User sent you a request</div>
        </div>
      )
    });

    const friends = filteredFriends.map(user => {
      return (
        <div key={user.id}>
          <div>{user.username} Already in contact list</div>
        </div>
      )
    });

    const requests = this.state.requests.map(request => {
      return (
        <div key={request.sender.id}>
          <div>{request.sender.username}</div>
          <button onClick={this.acceptRequest.bind(this, request.contact)} type="button">Accept Request</button>
          <button onClick={this.declineRequest.bind(this, request.contact)} type="button">Decline Request</button>
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
        <input type="text" placeholder='Search...' value={this.state.search} onChange={this.updateSearch.bind(this)} />
        <div>
        <br/>
          <strong>All Users:</strong>
          {moreUsers}
          {sentRequests}
          {receivedRequests}
          {friends}
        </div>
        <br/>
        <div>
          <strong>All Pending Requests:</strong>
          {requests}
        </div>
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
