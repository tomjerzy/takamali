var mongoose = require('mongoose');
const Schema = mongoose.Schema;
var check = new Schema({
		email: {
			type: String,
		    unique: true
		},
		contact: {
			type: Number,
			unique: true
		},
		password: String,
		created_at: Date,
		code: Number,
		userId: Schema.Types.ObjectId
	});
module.exports = mongoose.model('Check', check);