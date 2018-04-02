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

exports.insertUser = insertUser;
