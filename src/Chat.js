import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
	return {
		auth: state.auth
	}
}

class Chat extends React.Component {
	constructor() {
		super();
		this.state = {
			messages: [],
			socket: window.io(location.host),
			user: {name: 'guest'},
			users: []
		};
		this.scrollToBottom = this.scrollToBottom.bind(this);
		this.submitMessage = this.submitMessage.bind(this);
	}

	componentDidMount() {
		this.scrollToBottom();
		const self = this;
		this.state.socket.on('receive-message', function(msg) {
			self.setState({ messages: msg });
		});
		this.state.socket.on('users list', function(users) {
			self.setState({ users })
		})
	}

	componentWillUnmount() {
		this.state.socket.emit('unmount', 'please disconnect');
	}

	componentDidUpdate() {
		this.scrollToBottom();
	}

	componentWillReceiveProps(nextProps) {
		let user;
		if (nextProps.auth && nextProps.auth.name) {
			user = nextProps.auth.name;
		} else {
			user = 'guest';
		}
		this.state.socket.emit('user', user);
	}

	scrollToBottom() {
		this.messagesEnd.scrollIntoView({ behavior: 'smooth' });
	}

	submitMessage() {
		event.preventDefault();
		let name = 'guest';
		let msg = document.getElementById('message').value;
		if (this.props.auth && this.props.auth.name) {
			name = this.props.auth.name;
		}
		if (/<script>/g.test(msg)) {
			return;
		}
		let message = {
			user: name,
			message: msg
		};
		this.state.socket.emit('new-message', message);
		document.getElementById('message').value = '';
	}

	render() {
		let messages = this.state.messages.map((msg, i) => {
			return <li key={i}>{msg.user}: {msg.message}</li>
		});

		let users = this.state.users.map((user, i) => {
			return <li key={i}>{user}</li>
		});

		return (
			  <div className="main-container">
			  	<div className="chat-left">
				  <ul className="messages-container">
				    {messages}
				    <li style={{float: 'left', clear: 'both'}} ref={(el) => { this.messagesEnd = el; }} />
				  </ul>
				  <div class="write-message-container">
				    <form onSubmit={this.submitMessage}>
				      <input id="message" type="text" placeholder="Write your message here" />
				      <button type="submit">Send</button>
				    </form>
			      </div>
			    </div>
			    <div className="chat-right">
			      <div className="users-container">
			        Online
			        <ul>
			          {users}
			        </ul>
			      </div>
			    </div>
			  </div>
		);
	}
}

export default connect(mapStateToProps)(Chat);
