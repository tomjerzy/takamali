var mongoose = require('mongoose');
const Schema = mongoose.Schema;
var notification = new Schema({
		body: String,
		read: Boolean,
		item_id: Schema.Types.ObjectId,
		type: String,
		sender: { type: Schema.Types.ObjectId, ref: 'User' },
		receiver: Schema.Types.ObjectId,
		created_at: Date,
	});
module.exports = mongoose.model('Notification', notification);