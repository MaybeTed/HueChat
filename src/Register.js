import React from 'react';

class Register extends React.Component {
	constructor() {
		super();
		this.state = {
			nameResponse: '',
			passResponse: '',
			emailResponse: ''
		}
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
			  	<input id="userpass"/>
			  	<div className="password-response">{this.state.passResponse}</div>
			  	Email
			  	<br />
			  	<input id="email"/>
			  	<div className="email-response">{this.state.emailResponse}</div>
			  	<button>Submit</button>
			  </div>
		);
	}
}

export default Register;
