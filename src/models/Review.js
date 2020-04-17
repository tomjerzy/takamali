var mongoose = require('mongoose');
const Schema = mongoose.Schema;
var review = new Schema({
		review: String,
		user: { type: Schema.Types.ObjectId, ref: 'User' },
		created_at: Date,
	});
module.exports = mongoose.model('Review', review);