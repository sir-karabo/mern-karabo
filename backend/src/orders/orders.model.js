const { Schema, model } = require('mongoose')
const bcrypt = require('bcrypt') // You can remove this if not using bcrypt in the schema

const OrderSchema = new Schema(  // Use 'Schema' instead of 'mongoose.Schema'
	{
		orderId: { type: String, unique: true }, // Unique order ID
		products: [
			{
				productId: { type: String, required: true },
				quantity: { type: Number, required: true },
			},
		],
		amount: { type: Number, required: true, min: 0 }, // Ensure the amount is non-negative
		email: { type: String, required: true, match: /.+\@.+\..+/ }, // Email validation
		status: {
			type: String,
			enum: ['pending', 'processing', 'shipped', 'completed'],
			default: 'pending',
		},
	},
	{ timestamps: true }
)

const Order = model('Order', OrderSchema)

module.exports = Order
