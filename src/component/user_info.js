import React, { Component } from 'react';
import Form from './form';
import axios from 'axios';

class UserInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: this.props.avatar,
    };
  }

  handleCancel(event) {
    this.props.onCancel(event);
  }

  handleUpload(event) {
    event.preventDefault();

    const file = event.target.image.files[0];
    this.props.onImageUpdate(event, file);
  }

  render() {
    return (
      <div className="user-info clearfix">
        <img className="img-thumbnail" src={this.state.avatar} alt="Avatar" />

        <form className="image-form" onSubmit={this.handleUpload.bind(this)} >
          <label>Upload new avatar</label>
          <input id="image" type="file" name="image" accept="image/x-png, image/gif, image/jpeg" />
          <button className="btn btn-default blue-button" type="submit">Upload</button>
        </form>

        <div className="update-user-form">
          <Form session={this.props.session} onCancel={this.props.onCancel} onUpdateUser = {this.props.onUpdateUser} />
        </div>

      </div>
    );
  }
}

export default UserInfo;
