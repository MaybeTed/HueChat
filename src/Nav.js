import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import Actions from './actions/index';

const mapStateToProps = (state) => {
	return {
		auth: state.auth
	}
}

class Nav extends React.Component {
	constructor() {
		super();
		this.state = {
			
		}
		this.logout = this.logout.bind(this);
	}

	componentDidMount() {
		Actions.fetchUser();
	}

	logout() {
		axios.get('/logout').then(() => {
			Actions.fetchUser();
			this.props.history.push('/')
		})
	}

	render() {
		console.log('this.props.auth: ', this.props.auth)
		return (
			<div className="nav-container">
			  <ul className="login-buttons">
			    {this.props.auth ?
			    	<div>
			    	<p>Welcome {this.props.auth.name}</p>
			    	<li onClick={this.logout}>Logout</li>
			    	</div>
			    	:
			    	<div>
			        <Link to="/register" ><li>Sign Up</li></Link>
			        <Link to="/login" ><li>Login</li></Link>
			        </div>
			    }
			  </ul>
			  <Link to="/"><h1 className="title">Hue Chat</h1></Link>
			</div>
		)
	}
}

export default withRouter(connect(mapStateToProps)(Nav));
