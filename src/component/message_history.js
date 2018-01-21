import React, { Component } from 'react';
import axios from 'axios';
import {ActionCable} from 'react-actioncable-provider';
import dateFormat from 'dateformat';

class MessageHistory extends Component {
  constructor(props) {
    super(props);
    this.getMessages();
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

    axios.get('http://localhost:8080/messages?from=' + this.props.session.id + '&to=' + this.props.contact.id).then((response) => {
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
        to: this.props.contact.id,
        language_id: this.props.contact.language_id,
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
    this.updateMessages(messages);
  }

  handleMouseHover() {
    this.setState({
      hover: !this.state.hover,
    })
  }

  divideMessagesByDate() {
    let messageHash = {};
    for(let message of this.state.messages) {
      const date = new Date(message.created_at.slice(0,10));
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
      <div key={message.id} className={className}
      onMouseEnter={this.handleMouseHover.bind(this)} onMouseLeave={this.handleMouseHover.bind(this)}
      >
        <p className="pull-right">{message.from === this.props.session.id ? message.text : message.message ? message.message : message.text}</p>
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
            <ActionCable ref='cable' channel={{channel: 'MessagesChannel', id: this.props.contact.id}} onReceived={this.onMessage.bind(this)} />
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
