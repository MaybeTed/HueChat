import React from 'react';

class Nav extends React.Component {
	constructor() {
		super();
		this.state = {

		}
	}

	render() {
		return (
			<div className="nav-container">
			  <ul className="login-buttons">
			    <li>Sign Up</li>
			    <li>Login</li>
			  </ul>
			  <h1 className="title">Hue Chat</h1>
			</div>
		)
	}
}

export default Nav;
