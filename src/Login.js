import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import Actions from './actions/index';

class Login extends React.Component {
	constructor() {
		super();
		this.state = {
			nameResponse: '',
			passResponse: '',
			confirm: false,
			confirmError: '',
			confirmEmailError: ''
		}
		this.handleConfirm = this.handleConfirm.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
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
			} else if (response.data === 'confirm email') {
				this.setState({ confirm: true });
			}
		})
	}

	render() {
		if (this.state.confirm) {
			return (
				<div className="login">
				  <p>You have not confirmed your email address yet.</p>
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
