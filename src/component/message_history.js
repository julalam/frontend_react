import React, { Component } from 'react';
import axios from 'axios';
import dateFormat from 'dateformat';
import Push from 'push.js';

class MessageHistory extends Component {
  constructor(props) {
    super(props);
    this.getMessages();
    this.state = {
      messages: [],
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.session !== prevProps.session || this.props.contact !== prevProps.contact){
      this.getMessages();
    }
  };

  updateMessages(messages) {
    this.setState({
      messages: messages,
    }, () => {
      this.messageHistory.scrollTop = this.messageHistory.scrollHeight;
    });
  }

  getMessages() {
    if (!this.props.contact) {
      return;
    }

    axios.get('http://localhost:8080/messages?from=' + this.props.session.id + '&to=' + this.props.contact.user.id).then((response) => {
      const messages = Array.from(response.data);
      this.updateMessages(messages);
    });
  };

  sendMessage(event) {
    event.preventDefault();

    if (event.target.message.value !== '') {
      axios.post('http://localhost:8080/messages', {
        text: event.target.message.value,
        from: this.props.session.id,
        to: this.props.contact.user.id,
        language_id: this.props.contact.user.language_id,
      }).then((response) => {
        console.log('Message successfully sent');
      });
      event.target.message.value = '';
    }
  };

  onMessage(message) {
    console.log('Message received by message history');
    if (message.from !== this.props.contact.user.id &&
        message.to !== this.props.contact.user.id) {
       return;
    }

    const messages = this.state.messages.slice();

    messages.push(message);
    this.updateMessages(messages);

    if (document.hidden && message.from !== this.props.session.id) {
      Push.create(`New message from ${this.props.contact.user.username}`, {
        body: message.text,
        icon: '/favicon.ico'
      });
    }
  }

  divideMessagesByDate() {
    let messageHash = {};
    for(let message of this.state.messages) {
      const date = new Date(dateFormat(message.created_at).slice(0,16));
      if (!messageHash.hasOwnProperty(date)) {
        messageHash[date] = [];
      }
      messageHash[date].push(message);
    }
    return messageHash;
  }

  getMessageDates(messageHash) {
    const dates = Object.keys(messageHash).sort((a,b) => a-b);
    return dates;
  }

  messageAsDiv(message) {
    const from_me = message.from === this.props.session.id;
    const className = "message clearfix " + (from_me ? "pull-right from" : "pull-left to");
    return (
      <div key={message.id} className={className}>
        <p data-toggle="tooltip" data-placement="top" title="Hooray!"  className="pull-right" ref={p => this.message = p} >{message.from === this.props.session.id ? message.text : message.message ? message.message : message.text}</p>
      </div>
    );
  }

  render() {
    const messagesByDate = this.divideMessagesByDate();
    const dates = this.getMessageDates(messagesByDate);
    const allMessages = dates.map(date => {
      const messages = messagesByDate[date].map(message => this.messageAsDiv(message));

      return (
        <div key={date}>
          <small><p className="date clearfix">{dateFormat(date).slice(0,10)}</p></small>
          {messages}
        </div>
      );
    });

    if (!this.props.contact) {
      return (
        <div className="message-history"><p>Add friends to chat...</p></div>
      )
    } else {
      return (
        <div className="message-history" ref={div => this.messageHistory = div}>
          <div className="messages clearfix">
              {allMessages}
          </div>
          <div className="new-message">
            <form onSubmit={this.sendMessage.bind(this)}>
              <div className="input-group">
                <input className="form-control" type="text" placeholder="Type a message..." name="message" />
                <div className="input-group-addon">
                  <span className="glyphicon glyphicon-send"></span>
                </div>
              </div>
            </form>
          </div>
        </div>
      );
    }
  }
}

export default MessageHistory;
