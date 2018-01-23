import React, { Component } from 'react';
import Form from './form';

class UserInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      infoSuccess: this.props.infoSuccess,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.infoSuccess !== prevProps.infoSuccess) {
      setTimeout(() => {
        this.props.closeReport('infoSuccess');
      }, 5000);
    } else if (this.props.infoErrors !== prevProps.infoErrors) {
      setTimeout(() => {
        this.props.closeReport('infoErrors');
      }, 5000);
    } else if (this.props.imageSuccess !== prevProps.imageSuccess) {
      setTimeout(() => {
        this.props.closeReport('imageSuccess');
      }, 5000);
    } else if (this.props.imageErrors !== prevProps.imageErrors) {
      setTimeout(() => {
        this.props.closeReport('imageErrors');
      }, 5000);
    }
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
        <img className="img-thumbnail" src={this.props.avatar} alt="Avatar" />

        <form className="image-form" onSubmit={this.handleUpload.bind(this)} >
          <label>Upload new avatar</label>
          <input id="image" type="file" name="image" accept="image/x-png, image/gif, image/jpeg" />
          <button className="btn btn-default blue-button pull-right" type="submit">Upload</button>
        </form>

        {this.props.imageErrors && <div className="clearfix error"><small>{this.props.imageErrors}</small></div>}
        {this.props.imageSuccess && <div className="clearfix success"><small>{this.props.imageSuccess}</small></div>}

        <div className="update-user-form">
          <Form session={this.props.session}  onCancel={this.props.onCancel} onUpdateUser = {this.props.onUpdateUser} />
        </div>

        {this.props.infoErrors && <div className="clearfix error"><small>{this.props.infoErrors}</small></div>}
        {this.props.infoSuccess && <div className="clearfix success"><small>{this.props.infoSuccess}</small></div>}

      </div>
    );
  }
}

export default UserInfo;
