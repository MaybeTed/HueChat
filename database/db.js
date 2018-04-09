const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/huechat', (err) => {
	if (err) throw err;
	console.log('Successfully connected');
});

const userSchema = mongoose.Schema({
	username: { type: String, required: true },
	password: { type: String, required: true },
	email: { type: String, required: true },
	salt: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

function insertUser(name, password, email, salt) {
	let user = new User({
		username: name,
		password: password,
		email: email,
		salt: salt
	})
	user.save();
}

const messagesSchema = mongoose.Schema({
	user: { type: String, required: true },
	message: { type: String, required: true }
});

const Message = mongoose.model('Message', messagesSchema);

function insertMessage(name, message, callback) {
	let msg = new Message({
		user: name,
		message: message,
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
