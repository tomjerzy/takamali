var mongoose = require('mongoose');
var user = new mongoose.Schema({
	name: String,
	male: Boolean,
	county: Object,
	account: String,
	waste: String,
	wasteInfo: String,
	contact: Number,
	email: String,
	about: String,
	created_at: Date
});
module.exports = mongoose.model('User', user);