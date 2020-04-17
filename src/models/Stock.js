var mongoose = require('mongoose');
const Schema = mongoose.Schema;
var stock = new Schema({
		weight: Number,
		cost: Number,
		description: String,
		location: String,
		category: String,
		subcategory: String,
		user: { type: Schema.Types.ObjectId, ref: 'User' },
		county: String,
		created_at: Date,
	});
module.exports = mongoose.model('Stock', stock);