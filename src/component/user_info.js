import React, { Component } from 'react';

class UserInfo extends Component {
  handleCancel(event) {
    this.props.onCancel(event);
  }

  render() {
    return (
      <div>
        Here I am going to edit user info
        <button className="pull-right" onClick={this.handleCancel.bind(this)} type="button">Cancel</button>
      </div>
    );
  }
}

export default UserInfo;
