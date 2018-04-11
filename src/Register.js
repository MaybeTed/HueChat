import React from 'react';
import axios from 'axios';
import { withRouter } from "react-router-dom";
import Actions from './actions/index';

class Register extends React.Component {
	constructor() {
		super();
		this.state = {
			nameResponse: '',
			passResponse: '',
			emailResponse: ''
		}
		this.registerUser = this.registerUser.bind(this);
	}

	invalidEmail(email) {
		let valid = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/.test(email);
		return !valid;
	}

	isMalicious(input) {
		if (/<script>/g.test(input)) {
			return true;
		}
		return false;
	}

	registerUser() {
		let name = document.getElementById('userlogin').value;
		if (!name.length) {
			this.setState({ nameResponse: 'please enter a username' })
			return;
		}
		if (this.isMalicious(name) === true) {
			this.setState({ nameResponse: 'try a different name' })
			return;
		}
		let password = document.getElementById('userpass').value;
		if (!password.length) {
			this.setState({ passResponse: 'please enter a password' })
			return;
		}
		if (this.isMalicious(password) === true) {
			this.setState({ passResponse: 'try a different password' })
			return;
		}
		let email = document.getElementById('email').value;
		if (!email.length) {
			this.setState({ emailResponse: 'please enter your email'})
			return;
		}
		if (this.isMalicious(email) === true) {
			this.setState({ emailResponse: 'try a different email' })
			return;
		}
		if (this.invalidEmail(email)) {
			this.setState({ emailResponse: 'invalid email address. try again' })
			return;
		}
		axios.post('/api/register', {
			name,
			password,
		   	email
		}).then(() => {
			Actions.fetchUser();
			this.props.history.push('/')
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
			  	Email
			  	<br />
			  	<input id="email"/>
			  	<div className="email-response">{this.state.emailResponse}</div>
			  	<button onClick={this.registerUser}>Submit</button>
			  </div>
		);
	}
}

export default withRouter(Register);
