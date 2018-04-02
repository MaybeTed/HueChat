import React from 'react';

class Login extends React.Component {
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
			  	Username
			  	<br />
			  	<input id="userlogin"/>
			  	<div className="username-response">{this.state.nameResponse}</div>
			  	Password
			  	<br />
			  	<input id="userpass"/>
			  	<div className="password-response">{this.state.passResponse}</div>
			  	<button>Submit</button>
			  </div>
		);
	}
}

export default Login;
