var mongoose = require('mongoose');
const Schema = mongoose.Schema;
var like = new Schema({
		liker: { type: Schema.Types.ObjectId, ref: 'User' },
		stock: Object,
		stockId: Schema.Types.ObjectId,
		created_at: Date
	});
module.exports = mongoose.model('Like', like);