import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import store from '../store';
import reducer from './reducers/index';
import Nav from './Nav';
import Chat from './Chat';
import Login from './Login';
import Register from './Register';
import Actions from './actions/index';

const mapStateToProps = (state) => {
	return {
		auth: state.auth
	}
}

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			
		}
		//this.logout = this.logout.bind(this);
	}

	componentDidMount() {
		Actions.fetchUser();
	}

	// logout() {
	// 	axios.get('/api/logout')
	// 	  .then(() => { 
	// 		this.setState({ user: {name: 'guest'} });
	// 	  })
	// }

	render() {
		return (
			<div>
				<Nav />
				<Switch>
					<Route exact path="/" render={() => (<Chat />)} />
					<Route path="/login" render={() => (<Login />)} />
					<Route path="/register" render={() => (<Register />)} />
				</Switch>
			</div>
		)
	}
}

document.addEventListener('DOMContentLoaded', function() {
	ReactDOM.render(
		<Provider store={store}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</Provider>,
		document.getElementById('mount')
	);
});

export default connect(mapStateToProps, { Actions })(App);