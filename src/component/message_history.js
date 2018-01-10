import React, { Component } from 'react';
import axios from 'axios';

class MessageHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.session !== prevProps.session || this.props.contact !== prevProps.contact) {
      axios.get('http://localhost:8080/messages?from=' + this.props.session.id + '&to=' + this.props.contact.id).then((response) => {
        const messages = Array.from(response.data);
        this.setState({
          messages: messages,
        })
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
        const allMessages = this.state.messages
        allMessages.push(response.data)
        this.setState({
          messages: allMessages,
        });
      });
      console.log('Message sent');
      event.target.message.value = '';
    }
  };

  render() {
      const messages = this.state.messages.map(message => {
      if (message.from === this.props.session.id) {
        return <div key={message.id}>{message.text}</div>
      } else {
        return <div key={message.id}>{message.message}</div>
      }
    });

    if (!this.props.contact) {
      return <p>select a user...</p>
    } else {
      return (
        <div>
        <strong>Message History:</strong>
        {messages}
        <div className="new-message">
        <form onSubmit={this.sendMessage.bind(this)}>
        <input type="text" placeholder="Type a message..." name="message" />
        <button type="submit">Send</button>
        </form>
        </div>
        </div>
      );
    }
  }
}

export default MessageHistory;
