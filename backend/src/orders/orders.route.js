const express = require('express')
const router = express.Router()
const Order = require('./orders.model')
const axios = require('axios') // For HTTP requests to PayFast
require('dotenv').config()

// create checkout session with PayFast
router.post('/create-checkout-session', async (req, res) => {
	const { products, email, amount } = req.body
	const totalAmount = Math.round(amount * 100) // PayFast requires the amount in cents
	const orderId = `order_${Date.now()}` // Unique order ID based on timestamp

	// Extract the line items with colors for products
	const lineItems = products.map((product) => ({
		name: product.name,
		quantity: product.quantity,
		price: product.price,
		color: product.color,  // Added the color field from your schema
	}))

	// Prepare the PayFast data
	const payFastData = {
		merchant_id: process.env.PAYFAST_MERCHANT_ID,
		merchant_key: process.env.PAYFAST_MERCHANT_KEY,
		amount: totalAmount,
		item_name: lineItems.map(item => item.name).join(", "), // Concatenate item names for PayFast
		item_description: lineItems.map(item => item.name).join(", "), // Same as item name
		email_address: email,
		return_url: 'http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}',
		cancel_url: 'http://localhost:5173/cancel',
		notify_url: 'http://localhost:5173/notify', // URL to handle IPN notifications
		custom_int1: orderId, // Custom order ID
		custom_str1: JSON.stringify(lineItems) // Save product info for later processing
	}

	try {
		// Send data to PayFast for processing
		const response = await axios.post(process.env.PAYFAST_URL, payFastData)

		// Return the PayFast payment URL for the client to complete the payment
		res.json({
			payment_url: `https://www.payfast.co.za/eng/process?${new URLSearchParams(payFastData).toString()}`
		})

	} catch (error) {
		console.error('Error creating PayFast checkout session:', error)
		res.status(500).json({ error: 'Failed to create PayFast checkout session' })
	}
})

// Confirm Payment using PayFast IPN
router.post('/confirm-payment', async (req, res) => {
	const { custom_int1, amount_gross, signature } = req.body

	try {
		// Validate PayFast's signature to ensure the request is from PayFast
		const signatureString = `merchant_id=${process.env.PAYFAST_MERCHANT_ID}&merchant_key=${process.env.PAYFAST_MERCHANT_KEY}&amount_gross=${amount_gross}&item_name=${req.body.item_name}&item_description=${req.body.item_description}&custom_int1=${custom_int1}`
		const expectedSignature = require('crypto')
			.createHash('md5')
			.update(signatureString)
			.digest('hex')

		// Compare the signatures
		if (expectedSignature !== signature) {
			console.log('Signature mismatch')
			return res.status(400).json({ error: 'Invalid signature' })
		}

		// Check the payment status from PayFast
		if (req.body.payment_status === 'COMPLETE') {
			// The payment is complete, fetch the order by custom_int1 (orderId)
			let order = await Order.findOne({ orderId: custom_int1 })

			// If the order doesn't exist, create a new one
			if (!order) {
				// You might need to get product details from PayFast data if not stored
				const products = JSON.parse(req.body.custom_str1) // Assuming this was sent as custom_str1
				const amount = parseFloat(amount_gross)

				order = new Order({
					orderId: custom_int1,
					products: products.map((product) => ({
						productId: product.productId,
						quantity: product.quantity,
					})),
					amount: amount,
					email: req.body.email_address,
					status: 'completed', // Update to completed since payment is confirmed
				})

				// Save the order to MongoDB
				await order.save()
				console.log('Order saved to MongoDB', order)
			} else {
				// Order already exists, just update the status to completed
				order.status = 'completed'
				await order.save()
				console.log('Order updated to completed', order)
			}

			res.json({ order })
		} else {
			// Payment is not complete, mark order as failed
			let order = await Order.findOne({ orderId: custom_int1 })

			if (order) {
				order.status = 'failed'
				await order.save()
			}

			res.status(400).json({ error: 'Payment not completed' })
		}
	} catch (error) {
		console.error('Error confirming PayFast payment:', error)
		res.status(500).json({ error: 'Failed to confirm payment' })
	}
})

// Get order by email address
router.get('/:email', async (req, res) => {
	const email = req.params.email
	if (!email) {
		return res.status(400).send({ message: 'Email is required' })
	}

	try {
		const orders = await Order.find({ email: email })

		if (orders.length === 0 || !orders) {
			return res
				.status(400)
				.send({ orders: 0, message: 'No orders found for this email' })
		}

		res.status(200).send({ orders })
	} catch (error) {
		console.error('Error fetching orders by email', error)
		res.status(500).send({ message: 'Failed to fetch orders by email' })
	}
})

// Get order by ID
router.get('/order/:id', async (req, res) => {
	try {
		// Fetch order by ID
		const order = await Order.findById(req.params.id)

		if (!order) {
			// If order is not found, return 404
			return res.status(404).send({ message: 'Order not found' })
		}

		// Send the found order details
		res.status(200).send(order)
	} catch (error) {
		// Handle any errors
		console.error('Error fetching order by user id:', error)
		res.status(500).send({ message: 'Failed to fetch order by user id' })
	}
})

// Get all orders
router.get('/', async (req, res) => {
	try {
		// Fetch all orders, sorted by creation date (descending)
		const orders = await Order.find().sort({ createdAt: -1 })

		if (orders.length === 0) {
			// If no orders exist, return 404
			return res.status(404).send({ message: 'No orders found', orders: [] })
		}

		// Return all orders
		res.status(200).send(orders)
	} catch (error) {
		// Handle any errors
		console.error('Error fetching all orders:', error)
		res.status(500).send({ message: 'Failed to fetch all orders' })
	}
})

// Update order status
router.patch('/update-order-status/:id', async (req, res) => {
	const { id } = req.params
	const { status } = req.body

	// Check if the status is provided in the request body
	if (!status) {
		return res.status(400).send({ message: 'Status is required' })
	}

	try {
		// Find and update the order with the new status
		const updatedOrder = await Order.findByIdAndUpdate(
			id,
			{
				status,
				updatedAt: new Date(), // Ensure the updatedAt field is set to the current date/time
			},
			{
				new: true, // Return the updated document
				runValidators: true, // Ensure any validation rules are applied to the update
			}
		)

		// If the order is not found, return a 404
		if (!updatedOrder) {
			return res.status(404).send({ message: 'Order not found' })
		}

		// Send the updated order and success message
		res.status(200).json({
			message: 'Order status updated successfully',
			order: updatedOrder,
		})
	} catch (error) {
		// Log and return an error message in case of a failure
		console.error('Error updating order status', error)
		res.status(500).send({ message: 'Failed to update order status' })
	}
})

// Delete order
router.delete('/delete-order/:id', async (req, res) => {
	const { id } = req.params

	try {
		// Find and delete the order by its ID
		const deletedOrder = await Order.findByIdAndDelete(id)

		// If the order doesn't exist, return a 404 response
		if (!deletedOrder) {
			return res.status(404).send({ message: 'Order not found' })
		}

		// Return a success response with the deleted order
		res.status(200).json({
			message: 'Order deleted successfully',
			order: deletedOrder,
		})
	} catch (error) {
		// Log and return an error message in case of a failure
		console.error('Error deleting order', error)
		res.status(500).send({ message: 'Failed to delete order' })
	}
})

module.exports = router
