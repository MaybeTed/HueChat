const express = require('express');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const path = require('path');
//const passport = require('passport');
//const flash = require('connect-flash');
const session = require('express-session');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const db = require('./database/db.js');
const io = require('socket.io')(http);

const compiler = webpack(webpackConfig);

const port = process.env.port || '3000';

app.use(session({
	secret: 'eiuvpq',
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false }
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

app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.post('/api/register', (req, res) => {
	db.insertUser(req.body.name, req.body.email);
	req.session.regenerate(() => {
		req.session.user = {
			name: req.body.name,
			email: req.body.email
		}
		req.session.save();
	});
	res.end();
});

app.get('/api/getUser', (req, res) => {
	if (req.session.user) {
		res.send(req.session.user);
	} else {
		res.send('');
	}
});

app.get('/logout', (req, res) => {
	req.session.destroy();
	res.end();
})

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '/www/index.html'));
});

// sockets
io.on('connection', function(socket) {
	console.log('we have a connection');
	socket.on('new-message', function(msg) {
		console.log('the message: ', msg);
		io.emit('receive-message', msg);
	})
})

http.listen(port, function() {
	console.log('Chat app is listening')
})