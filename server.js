const express = require('express');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const nodemailer = require('nodemailer');
const app = express();
const http = require('http').Server(app);
const db = require('./database/db.js');
const io = require('socket.io')(http);

const compiler = webpack(webpackConfig);

const port = process.env.PORT || '3000';

let connections = [];
let users = [];

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
	secret: 'eiuvpq',
	saveUninitialized: true,
	resave: false,
	cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

app.use(express.static(__dirname + '/www'));

app.use(webpackDevMiddleware(compiler, {
	hot: true,
	filename: 'bundle.js',
	publicPath: '/',
	stats: {
		colors: true,
	},
	historyApiFallback: true,
}));



/***                                     ***/
/***     Email users to confirm account  ***/
/***                                     ***/

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'HueChatMailer@gmail.com',
		pass: process.env.mailPass || 'gkw92hy57'
	}
});

// create confirmation code
const randomNumber = () => {
	const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
    return Math.floor(Math.random() * 1000) + letters[Math.floor(Math.random() * letters.length)] + Math.floor(Math.random() * 100);
}

const welcomeMailOptions = (email, username, confirmNumber) => ({
	from: 'no-reply@huechatmailer.com',
	to: email,
	subject: 'Welcome to Hue-Chat, ' + username + '!',
	text: 'Your confirmation number is: ' + confirmNumber
});



/***                     ***/
/***     API Routes      ***/
/***                     ***/

app.post('/api/register', (req, res) => {
	const salt = bcrypt.genSaltSync();
	const hash = bcrypt.hashSync(req.body.password, salt);
	const confirmNumber = randomNumber();
	db.insertUser(req.body.name, hash, req.body.email, salt, confirmNumber);
	transporter.sendMail(welcomeMailOptions(req.body.email, req.body.name, confirmNumber), function(error, info) {
		if (error) {
			console.error(error);
		} else {
			console.log('email success: ', info.response);
		}
	});
	res.end();
});

app.post('/api/confirm', (req, res) => {
	const userResponse = req.body.answer;
	const email = req.body.email;
	db.user.findOne({ email: email })
		.exec(function(err, data) {
			if (data === null) {
				res.send('could not find that email in database');
			} else if (userResponse === data.confirmNumber) {
				// update user confirmed from false to true
				data.confirmed = true;
				data.save();
				req.session.regenerate(() => {
					req.session.user = {
						name: data.username,
						email: req.body.email
					}
					req.session.save();
				});
				res.send('success');
			} else {
				res.send('number error');
			}
		})
});

app.get('/api/getUser', (req, res) => {
	if (req.session.user) {
		res.send(req.session.user);
	} else {
		res.send('');
	}
});

app.post('/login', (req, res) => {
	let name = req.body.username;
	let pass = req.body.password;
	db.user.findOne({ username: name })
		.exec(function(err, data) {
			if (data === null) {
				res.send('noUser');
			} else {
				const password = data.password;
				const salt = data.salt;
				const hash = bcrypt.hashSync(pass, salt);
				if (hash === password) {
					req.session.user = {
						name: data.username,
						email: data.email
					}
					res.send('success');
				} else {
					res.send('incorrect password');
				}
			}
		})
});

app.get('/logout', (req, res) => {
	req.session.destroy();
	res.end();
});

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '/www/index.html'));
});



/***                    ***/
/***       SOCKETS      ***/
/***                    ***/

io.on('connection', function(socket) {
	connections.push(socket);
	console.log('Connected: %s sockets connected', connections.length);

	function getMessages() {
		// Get messages from mongo
		db.message.find()
			.exec(function(err, data) {
				if (err) {
					console.log('error retrieving messages: ', err);
				}
				// emit the messages
				io.sockets.emit('receive-message', data);
			});
	}
	// when user connects, send them all the messages
	getMessages();

	function getUsers() {
		users = [];
		for (var item in io.sockets.sockets) {
			console.log('socketID: ', item, ' username: ', io.sockets.sockets[item]['username'])
			users.push(io.sockets.sockets[item]['username']);
		}
		io.sockets.emit('users list', users);
	}

	// Save username to socket
	socket.on('user', function(data) {
		socket.username = data;
		getUsers();
	})



	// Handle new message
	socket.on('new-message', function(msg) {
		// insert into db
		db.insertMessage(msg.user, msg.message, msg.color, msg.font, getMessages);
	})

	// Disconnect when navigating away from chat component
	socket.on('unmount', function(data) {
		socket.disconnect();
	})

	// Disconnect
	socket.on('disconnect', function(data) {
	  connections.splice(connections.indexOf(socket), 1);
	  users.splice(users.indexOf(socket), 1);
	  getUsers();
	  console.log('number of users: ', users.length)
	  console.log('Disconnected: %s sockets connected', connections.length);
	});

})

http.listen(port, function() {
	console.log('Chat app is listening at: ', port)
})