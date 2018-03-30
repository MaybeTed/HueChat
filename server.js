const express = require('express');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const compiler = webpack(webpackConfig);

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

io.on('connection', function(socket) {
	console.log('we have a connection');
	socket.on('new-message', function(msg) {
		console.log('the message: ', msg);
		io.emit('receive-message', msg);
	})
})

http.listen('3000', function() {
	console.log('Chat app is listening')
})