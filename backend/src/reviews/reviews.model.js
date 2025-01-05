const mongoose = require('mongoose')

const Reviews = mongoose.model('Review', new mongoose.Schema(
		{
			comment: { type: String, required: true },
			rating: { type: Number, required: true },
			userId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
				required: true,
			},
			productId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Product',
				required: true,
			},
		},
		{ timestamps: true }
	))

module.exports = Reviews
