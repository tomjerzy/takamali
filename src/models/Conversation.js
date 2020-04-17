var mongoose = require('mongoose');
const Schema = mongoose.Schema;
var conversation = new Schema({
		sender: { type: Schema.Types.ObjectId, ref: 'User' },
		receiver: { type: Schema.Types.ObjectId, ref: 'User' },
		created_at: Date,
	});
module.exports = mongoose.model('Conversation', conversation);