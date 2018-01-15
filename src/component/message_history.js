import React, { Component } from 'react';
import axios from 'axios';
import {ActionCable} from 'react-actioncable-provider'

class MessageHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      hover: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('componentDidMount');
    if (this.props.session !== prevProps.session || this.props.contact !== prevProps.contact){
      axios.get('http://localhost:8080/messages?from=' + this.props.session.id + '&to=' + this.props.contact.id).then((response) => {
        const messages = Array.from(response.data);
        this.setState({
          messages: messages,
        });
      });
    }
  };

  sendMessage(event) {
    event.preventDefault();

    if (event.target.message.value === '') {
      alert('the message can\'t be blank');
    } else {
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
    let messages = this.state.messages;
    messages.push(message);
    this.setState({
        messages: messages
    });
  }

  handleMouseHover() {
    this.setState({
      hover: !this.state.hover,
    })
  }

  render() {
    console.log(this.props.contact);
    console.log(this.props.session);
    console.log(this.state.messages);
    const messages = this.state.messages.map(message => {
      const from_me = message.from === this.props.session.id;
      const className = "message clearfix " + (from_me ? "pull-right" : "pull-left");
      return (
        <div key={message.id} className={className}
        // onMouseEnter={this.handleMouseHover.bind(this)} onMouseLeave={this.handleMouseHover.bind(this)}
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
        <div>
          <strong>Message History with user {this.props.contact.username}:</strong>
          <ActionCable ref='cable' channel={{channel: 'MessagesChannel', id: this.props.contact.id}} onReceived={this.onMessage.bind(this)} />
          <div className="clearfix">
            {messages}
          </div>
          <div className="new-message">
            <form onSubmit={this.sendMessage.bind(this)}>
              <input type="text" placeholder="Type a message..." name="message" />
            </form>

            <textarea className="form-control expandable" type="text" id="myIn2" placeholder="Bottom expandable" rows="3"></textarea>

          </div>
        </div>
      );
    }
  }
}

export default MessageHistory;
