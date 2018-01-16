import React, { Component } from 'react';
import axios from 'axios';
import {ActionCable} from 'react-actioncable-provider'

class MessageHistory extends Component {
  constructor(props) {
    super(props);
    if (this.props.contact) {
      this.getMessages();
    }
    this.state = {
      messages: [],
      hover: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.session !== prevProps.session || this.props.contact !== prevProps.contact){
      this.getMessages();
    }
  };

  getMessages() {
    axios.get('http://localhost:8080/messages?from=' + this.props.session.id + '&to=' + this.props.contact.id).then((response) => {
      const messages = Array.from(response.data);
      this.setState({
        messages: messages,
      });
    });
  };

  sendMessage(event) {
    event.preventDefault();

    if (event.target.message.value !== '') {
      axios.post('http://localhost:8080/messages', {
        text: event.target.message.value,
        from: this.props.session.id,
        to: this.props.contact.id,
        language: this.props.contact.language,
      }).then((response) => {
        console.log('Message successfully sent');
      });
      event.target.message.value = '';
    }
  };

  onMessage(message) {
    console.log('Message received');
    const messages = this.state.messages.slice();

    // const newMessage = messages.forEach(text => {
    //   if (text.id === message.id) {
    //     return false;
    //   }
    // })
    // if (newMessage) {
    //   messages.push(message);
    //   this.setState({
    //     messages: messages,
    //   });
    // }

    // if (!messages.includes(message)) {
    //   messages.push(message);
    //   this.setState({
    //     messages: messages,
    //   });
    // }

    messages.push(message);
    this.setState({
      messages: messages,
    });
  }

  handleMouseHover() {
    this.setState({
      hover: !this.state.hover,
    })
  }

  render() {
    const messages = this.state.messages.map(message => {
      const from_me = message.from === this.props.session.id;
      const className = "message clearfix " + (from_me ? "pull-right from" : "pull-left to");
      return (
        <div key={message.id} className={className}
        onMouseEnter={this.handleMouseHover.bind(this)} onMouseLeave={this.handleMouseHover.bind(this)}
        >
          <p className="pull-right">{message.from === this.props.session.id ? message.text : message.message ? message.message : message.text}</p>
        </div>
      );
    });

    if (!this.props.contact) {
      return (
        <div><p>select a user...</p></div>
      )
    } else {
      return (
        <div className="message-history">
          <strong>Message History with user {this.props.contact.username}:</strong>
          <div className="messages">
            <ActionCable ref='cable' channel={{channel: 'MessagesChannel', id: this.props.contact.id}} onReceived={this.onMessage.bind(this)} />
            <div className="clearfix">
              {messages}
            </div>
          </div>
          <div className="new-message">
            <form onSubmit={this.sendMessage.bind(this)}>
              <input type="text" placeholder="Type a message..." name="message" />
            </form>
          </div>
        </div>
      );
    }
  }
}

export default MessageHistory;
