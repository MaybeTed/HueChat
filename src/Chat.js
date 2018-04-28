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
			color: 'black',
			font: 'arial',
			messages: [],
			socket: window.io(location.host),
			user: {name: 'guest'},
			users: [],
			focus: true
		};
		this.changeFont = this.changeFont.bind(this);
		this.newMessage = this.newMessage.bind(this);
		this.scrollToBottom = this.scrollToBottom.bind(this);
		this.selectColor = this.selectColor.bind(this);
		this.submitMessage = this.submitMessage.bind(this);
	}

	componentDidMount() {
		this.scrollToBottom();
		this.state.socket.emit('user', this.state.user.name)
		const self = this;
		this.state.socket.on('receive-message', function(msg) {
			self.newMessage();
			self.setState({ messages: msg });
		});
		this.state.socket.on('users list', function(users) {
			self.setState({ users })
		})
		this.onFocus();
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

	changeFont(e) {
		this.setState({ font: e.target.value })
	}

	newMessage() {
		const title = 'Hue-Chat';
		const msg = 'NEW MESSAGE';
		while(this.state.focus === false) {
			setTimeout(() => {
				document.title = document.title === title ? msg : title;
			}, 700);
		}
	}

	onFocus() {
		let self = this;
		window.onfocus = function() {
			self.setState({ focus: true })
		}

		window.onblur = function() {
			self.setState({ focus: false });
		}
	}

	scrollToBottom() {
		this.messagesEnd.scrollIntoView({ behavior: 'smooth' });
	}

	selectColor(color) {
		this.setState({ color });
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
			message: msg,
			color: this.state.color,
			font: this.state.font
		};
		this.state.socket.emit('new-message', message);
		document.getElementById('message').value = '';
	}

	render() {
		let messages = this.state.messages.map((msg, i) => {
			return <li key={i}>{msg.user}: <span style={{'color': msg.color, 'font-family': msg.font}}>{msg.message}</span></li>
		});

		let users = this.state.users.map((user, i) => {
			return <li key={i}>{user}</li>
		});

		const fontOptions = ['arial', 'courier', 'georgia', 'palatino', 'garamond', 'comic sans ms', 'trebuchet ms', 'impact'];
		let fonts = fontOptions.map((font, i) => {
			return <option value={font} key={i}>{font}</option>
		});

		const colorOptions = ['black', 'blue', 'red', 'green', 'orange', 'purple', 'pink'];
		let colors = colorOptions.map((color, i) => {
			return <div id={color} key={i} style={{'background': color}} onClick={() => this.selectColor(color)}/>
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
				      <input id="message" type="text" style={{'color': this.state.color, 'font-family': this.state.font }} placeholder="Write your message here" />
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
			      <select className="fonts-container" onChange={this.changeFont}>
			      	{fonts}
			      </select>
			      <div className="colors-container">
			      	{colors}
			      </div>
			    </div>
			  </div>
		);
	}
}

export default connect(mapStateToProps)(Chat);
