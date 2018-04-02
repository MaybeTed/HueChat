import React from 'react';

class Chat extends React.Component {
	constructor() {
		super();
		this.state = {
			messages: [],
			socket: window.io('http://localhost:3000')
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
		let message = document.getElementById('message').value;
		console.log('the message: ', message);
		this.state.socket.emit('new-message', message);
		document.getElementById('message').value = '';
	}

	render() {
		const self = this;
		let messages = self.state.messages.map((msg, i) => {
			return <li key={i}>{msg}</li>
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

export default Chat;
