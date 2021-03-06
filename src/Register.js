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
			emailResponse: '',
			confirm: false,
			confirmError: '',
			confirmEmailError: '',
			hasAccount: false,
			username: '',
			email: '',
			emailSent: ''
		}
		this.forgotPassword = this.forgotPassword.bind(this);
		this.handleConfirm = this.handleConfirm.bind(this);
		this.registerUser = this.registerUser.bind(this);
	}

	forgotPassword() {
		axios.post('/api/forgotPassword', {
			email: this.state.email
		}).then(() => {
			this.setState({ emailSent: 'An email has been sent. Please check your inbox' })
		})
	}

	handleConfirm() {
		let confirmationNumber = document.getElementById('confirmation').value;
		let confirmEmail = document.getElementById('confirmEmail').value;
		axios.post('/api/confirm', {
			answer: confirmationNumber,
			email: confirmEmail
		}).then((response) => {
			if (response.data === 'success') {
				Actions.fetchUser();
				this.props.history.push('/')
			} else if (response.data === 'number error') {
				this.setState({ confirmError: 'You have entered the wrong confirmation number' });
			} else {
				this.setState({ confirmEmailError: 'We couln\'t find that email address' });
			}
		})
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
		}).then((response) => {
			if (response.data && response.data.message === 'is confirmed') {
				this.setState({ hasAccount: true, username: response.data.username, email: response.data.email });
			} else if (response.data && response.data.message === 'username taken') {
				this.setState({ nameResponse: 'That username is already taken' });
			} else {
				this.setState({ confirm: true });
			}
		})
	}
	
	render() {
		if (this.state.confirm) {
			return (
				<div className="login">
				  <p>You have been sent an email with a confirmation number.</p>
				  <p>Please enter your confirmation number in the box below to complete your registration.</p>
				  <input id="confirmation" />
				  <div>{this.state.confirmError}</div>
				  <p>Please confirm your email address:</p>
				  <input id="confirmEmail" />
				  <div>{this.state.confirmEmailError}</div>
				  <button onClick={this.handleConfirm}>Submit</button>
				</div>
			)
		}

		return (
			  <div className="login">
			    {this.state.hasAccount ?
			    <div>
			    	<p>This email address already has an account.</p>
			    	<p>Your username is {this.state.username}</p>
			    	<p>If you have forgotten your password you can click the button below to have a new password sent to you</p>
			    	<button onClick={this.forgotPassword}>Forgot password</button>
			    	<div>{this.state.emailSent}</div>
			    </div>
			    :
			  	<div>
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
			    }
			  </div>
		);
	}
}

export default withRouter(Register);
