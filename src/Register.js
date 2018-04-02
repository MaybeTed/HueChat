import React from 'react';

class Register extends React.Component {
	constructor() {
		super();
		this.state = {
			nameResponse: '',
			passResponse: ''
		}
	}
	
	render() {
		return (
			  <div className="login">
			  	Enter your username
			  	<input id="userlogin"/>
			  	<div className="username-response">{this.state.nameResponse}</div>
			  	Enter your password
			  	<input id="userpass"/>
			  	<div className="password-response">{this.state.passResponse}</div>
			  </div>
		);
	}
}

export default Register;
