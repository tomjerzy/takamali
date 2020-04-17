var mongoose = require('mongoose');
const Schema = mongoose.Schema;
var information = new Schema({
		user: { type: Schema.Types.ObjectId, ref: 'User' },
		stock_id: Schema.Types.ObjectId,
		information: String,
		created_at: Date
	});
module.exports = mongoose.model('Information', information);