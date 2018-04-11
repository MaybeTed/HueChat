import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import Actions from './actions/index';

class Login extends React.Component {
	constructor() {
		super();
		this.state = {
			nameResponse: '',
			passResponse: ''
		}
		this.handleLogin = this.handleLogin.bind(this);
	}

	handleLogin() {
		let name = document.getElementById('userlogin').value;
		let pass = document.getElementById('userpass').value;
		axios('/login', {
			method: 'post',
			data: { username: name, password: pass },
			withCredentials: true
		}).then((response) => {
			if (response.data === 'success') {
				Actions.fetchUser();
				this.props.history.push('/');
			} else if (response.data === 'noUser') {
				this.setState({ nameResponse: 'That username does not exist!', passResponse: '' })
			} else if (response.data === 'incorrect password') {
				this.setState({ nameResponse: '', passResponse: 'incorrect password' })
			}
		})
	}

	render() {
		return (
			  <div className="login">
			  	Username
			  	<br />
			  	<input id="userlogin"/>
			  	<div className="username-response">{this.state.nameResponse}</div>
			  	Password
			  	<br />
			  	<input type="password" id="userpass"/>
			  	<div className="password-response">{this.state.passResponse}</div>
			  	<button onClick={this.handleLogin}>Submit</button>
			  </div>
		);
	}
}

export default withRouter(Login);
