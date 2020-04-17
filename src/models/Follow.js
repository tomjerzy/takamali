var mongoose = require('mongoose');
const Schema = mongoose.Schema;
var follow = new Schema({
		follower: { type: Schema.Types.ObjectId, ref: 'follower' },
		followed: { type: Schema.Types.ObjectId, ref: 'followed' },
		created_at: Date,
	});
module.exports = mongoose.model('Follow', follow);