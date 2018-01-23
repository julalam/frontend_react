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

  handleCloseReport(target, event) {
    this.props.closeReport(target);
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

        {this.props.imageErrors && <div onClick={this.handleCloseReport.bind(this, 'imageErrors')} className="clearfix error"><small>{this.props.imageErrors}</small></div>}
        {this.props.imageSuccess && <div onClick={this.handleCloseReport.bind(this, 'imageSuccess')} className="clearfix success"><small>{this.props.imageSuccess}</small></div>}

        <div className="update-user-form">
          <Form session={this.props.session}  onCancel={this.props.onCancel} onUpdateUser = {this.props.onUpdateUser} />
        </div>

        {this.props.infoErrors && <div onClick={this.handleCloseReport.bind(this, 'infoErrors')} className="clearfix error"><small>{this.props.infoErrors}</small></div>}
        {this.props.infoSuccess && <div onClick={this.handleCloseReport.bind(this, 'infoSuccess')} className="clearfix success"><small>{this.props.infoSuccess}</small></div>}

      </div>
    );
  }
}

export default UserInfo;
