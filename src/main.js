import React from 'react';
import ReactDOM from 'react-dom';
import Nav from './Nav';
import Chat from './Chat';
import Login from './Login';
import Register from './Register';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

class App extends React.Component {
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
		<BrowserRouter>
			<App />
		</BrowserRouter>,
		document.getElementById('mount')
	);
});