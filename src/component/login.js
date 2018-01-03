import React, { Component } from 'react';
// import Login from './component/login';
// import Register from './component/register';
import axios from 'axios'

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      username: '',
      session: '',
    };
  }

  handleSubmit(event) {
    event.preventDefault();

    console.log(event.target.username.value)

    if (event.target.username.value === '') {
      alert('please enter your username');
    } else {
      axios.post('http://localhost:8080/login', {
        username: event.target.username.value,
      }).then((response) => {
        this.setState({
          id: response.data.user.id,
          username: response.data.user.username,
          session: response.data.session,
        });
        console.log(`User ${this.state.username} logged in successfully`)
      })
    }
  }

  render() {
    return (
      <div className="login">
        <form onSubmit={this.handleSubmit.bind(this)}>
          <input type="text" placeholder="Username" name="username" />
          <button type="submit">Log In</button>
        </form>
      </div>
    );
  }
}

export default Login;
