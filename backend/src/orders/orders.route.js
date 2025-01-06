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
//  confirm payment

router.post('/confirm-payment', async (req, res) => {
	const { session_id } = req.body
	// console.log(session_id);

	try {
		const session = await stripe.checkout.sessions.retrieve(session_id, {
			expand: ['line_items', 'payment_intent'],
		})

		const paymentIntentId = session.payment_intent.id

		let order = await Order.findOne({ orderId: paymentIntentId })

		if (!order) {
			const lineItems = session.line_items.data.map((item) => ({
				productId: item.price.product,
				quantity: item.quantity,
			}))

			const amount = session.amount_total / 100

			order = new Order({
				orderId: paymentIntentId,
				products: lineItems,
				amount: amount,
				email: session.customer_details.email,
				status:
					session.payment_intent.status === 'succeeded' ? 'pending' : 'failed',
			})
		} else {
			order.status =
				session.payment_intent.status === 'succeeded' ? 'pending' : 'failed'
		}

		// Save the order to MongoDB
		await order.save()
		//   console.log('Order saved to MongoDB', order);

		res.json({ order })
	} catch (error) {
		console.error('Error confirming payment:', error)
		res.status(500).json({ error: 'Failed to confirm payment' })
	}
})

// get order by email address
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

// get order by id
router.get('/order/:id', async (req, res) => {
	try {
		const order = await Order.findById(req.params.id)

		if (!order) {
			return res.status(404).send({ message: 'Order not found' })
		}

		res.status(200).send(order)
	} catch (error) {
		console.error('Error fetching orders by user id', error)
		res.status(500).send({ message: 'Failed to fetch orders by user id' })
	}
})

// get all orders
router.get('/', async (req, res) => {
	try {
		const orders = await Order.find().sort({ createdAt: -1 })

		if (orders.length === 0) {
			return res.status(404).send({ message: 'No orders found', orders: [] })
		}

		res.status(200).send(orders)
	} catch (error) {
		console.error('Error fetching all orders', error)
		res.status(500).send({ message: 'Failed to fetch all orders' })
	}
})

// update order status
router.patch('/update-order-status/:id', async (req, res) => {
	const { id } = req.params
	const { status } = req.body

	if (!status) {
		return res.status(400).send({ message: 'Status is required' })
	}

	try {
		const updatedOrder = await Order.findByIdAndUpdate(
			id,
			{
				status,
				updatedAt: new Date(),
			},
			{
				new: true,
				runValidators: true,
			}
		)

		if (!updatedOrder) {
			return res.status(404).send({ message: 'Order not found' })
		}

		res.status(200).json({
			message: 'Order status updated successfully',
			order: updatedOrder,
		})
	} catch (error) {
		console.error('Error updating order status', error)
		res.status(500).send({ message: 'Failed to update order status' })
	}
})

// delete order
router.delete('/delete-order/:id', async (req, res) => {
	const { id } = req.params

	try {
		const deletedOrder = await Order.findByIdAndDelete(id)

		if (!deletedOrder) {
			return res.status(404).send({ message: 'Order not found' })
		}

		res.status(200).json({
			message: 'Order deleted successfully',
			order: deletedOrder,
		})
	} catch (error) {
		console.error('Error deleting order', error)
		res.status(500).send({ message: 'Failed to delete order' })
	}
})

module.exports = router
