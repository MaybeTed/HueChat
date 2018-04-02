import React from 'react';
import { Link } from 'react-router-dom';

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
			    <Link to="/register" ><li>Sign Up</li></Link>
			     <Link to="/login" ><li>Login</li></Link>
			  </ul>
			  <h1 className="title">Hue Chat</h1>
			</div>
		)
	}
}

export default Nav;
