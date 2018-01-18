import React, { Component } from 'react';
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
    console.log(file);
    let formData = new FormData();
    formData.append('avatar', file);

    if (file) {
      axios.patch('http://localhost:8080/users/' + this.props.session.id, formData, { headers: { 'Content-Type': 'multipart/form-data' }
      })
      .then((response) => {
        this.setState({
          avatar: response.data.avatar.substr(2),
        })
      });
    }
  }

  render() {
    return (
      <div>
        <img src={this.state.avatar} alt="Avatar" />
        <form onSubmit={this.handleUpload.bind(this)}>
          <input id="image" type="file" name="image" accept="image/x-png, image/gif, image/jpeg" />
          <button type="submit">Upload</button>
        </form>
        <button className="pull-right" onClick={this.handleCancel.bind(this)} type="button">Cancel</button>
      </div>
    );
  }
}

export default UserInfo;
