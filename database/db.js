const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/huechat', (err) => {
	if (err) throw err;
	console.log('Successfully connected');
});

const userSchema = mongoose.Schema({
	username: { type: String, required: true },
	email: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

function insertUser(name, email) {
	let user = new User({
		username: name,
		email: email
	})
	user.save();
}

const messagesSchema = mongoose.Schema({
	user: { type: String, required: true },
	message: { type: String, required: true }
});

const Message = mongoose.model('Message', messagesSchema);

function insertMessage(name, message) {
	let msg = new Message({
		user: name,
		message: message
	})
	msg.save();
}

exports.insertUser = insertUser;
exports.insertMessage = insertMessage;
exports.user = User;
exports.message = Message;
