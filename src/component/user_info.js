import React, { Component } from 'react';
import Form from './form';

class UserInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: this.props.avatar,
      // imageErrors: this.props.imageErrors,
      // infoErrors: this.props.infoErrors,
      // imageSuccess: this.props.imageSuccess,
      infoSuccess: this.props.infoSuccess,
    };
  }

  handleCancel(event) {
    // this.setState({
    //   imageErrors: '',
    //   infoErrors: '',
    //   imageSuccess: '',
    //   infoSuccess: '',
    // })
    this.props.onCancel(event);
  }

  handleUpload(event) {
    event.preventDefault();
    // this.setState({
    //   imageErrors: '',
    //   infoErrors: '',
    //   imageSuccess: '',
    //   infoSuccess: '',
    // })

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
          <button className="btn btn-default blue-button pull-right" type="submit">Upload</button>
        </form>

        // {this.state.imageErrors && <div className="clearfix error">{this.state.imageErrors}</div>}
        // {this.state.imageSuccess && <div className="clearfix success">{this.state.imageSuccess}</div>}

        <div className="update-user-form">
          <Form session={this.props.session}  onCancel={this.props.onCancel} onUpdateUser = {this.props.onUpdateUser} />
        </div>

        <div className="clearfix error">{this.props.infoErrors}</div>
        <div className="clearfix success">{this.state.infoSuccess}</div>

      </div>
    );
  }
}

export default UserInfo;
