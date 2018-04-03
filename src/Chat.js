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
			socket: window.io('http://localhost:3000'),
			user: {name: 'guest'}
		};
		this.submitMessage = this.submitMessage.bind(this);
	}

	componentDidMount() {
		const self = this;
		this.state.socket.on('receive-message', function(msg) {
			console.log('received this message: ', msg)
			let messages = self.state.messages;
			messages.push(msg);
			self.setState({ messages });
		});
	}

	submitMessage() {
		event.preventDefault();
		let name = 'guest';
		if (this.props.auth && this.props.auth.name) {
			name = this.props.auth.name;
		}
		let message = {
			user: name,
			message: document.getElementById('message').value
		};
		this.state.socket.emit('new-message', message);
		document.getElementById('message').value = '';
	}

	render() {
		let messages = this.state.messages.map((msg, i) => {
			console.log('msg: ', msg)
			return <li key={i}>{msg.user}: {msg.message}</li>
		});

		return (
			  <div className="main-container">
				<ul className="messages-container">
				  {messages}
				</ul>
				<div class="write-message-container">
				  <form onSubmit={this.submitMessage}>
				    <input id="message" type="text" placeholder="Write your message here" />
				    <button type="submit">Send</button>
				  </form>
			    </div>
			  </div>
		);
	}
}

export default connect(mapStateToProps)(Chat);
