var mongoose = require('mongoose');
const Schema = mongoose.Schema;
var message = new Schema({
		read: Boolean,
		body: String,
		conversation_id: Schema.Types.ObjectId,
		sender: { type: Schema.Types.ObjectId, ref: 'User' },
		receiver: { type: Schema.Types.ObjectId, ref: 'User' },
		created_at: Date,
	});
module.exports = mongoose.model('Message', message);