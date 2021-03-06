const mongoose = require('mongoose');

const connection = process.env.MONGOLAB_URI || 'mongodb://localhost/huechat';

mongoose.connect(connection, (err) => {
	if (err) throw err;
	console.log('Successfully connected');
});

const userSchema = mongoose.Schema({
	username: { type: String, required: true },
	password: { type: String, required: true },
	email: { type: String, required: true },
	salt: { type: String, required: true },
	confirmNumber: { type: String, required: true },
	confirmed: { type: Boolean, required: true }
});

const User = mongoose.model('User', userSchema);

function insertUser(name, password, email, salt, confirmNumber) {
	let user = new User({
		username: name,
		password: password,
		email: email,
		salt: salt,
		confirmNumber: confirmNumber,
		confirmed: false
	})
	user.save();
}

const messagesSchema = mongoose.Schema({
	user: { type: String, required: true },
	message: { type: String, required: true },
	color: { type: String, required: true },
	font: { type: String, required: true },
	date: { type: String, required: true }
});

const Message = mongoose.model('Message', messagesSchema);

function insertMessage(name, message, color, font, callback) {
	console.log('color from db b4 insert: ', color)
	let msg = new Message({
		user: name,
		message: message,
		color: color,
		font: font,
		date: new Date(),
	})
	msg.save().then(function() {
		callback();
	});
}

exports.insertUser = insertUser;
exports.insertMessage = insertMessage;
exports.user = User;
exports.message = Message;
