/* eslint-disable no-unused-vars */
import { useDispatch, useSelector } from 'react-redux'
import { loadStripe } from '@stripe/stripe-js'

import { getBaseUrl } from '../../utils/base-url'
import { clearCart } from '../../redux/features/cartSlice'

export default function OrderSummary() {
	const dispatch = useDispatch()
	const { user } = useSelector((state) => state.auth)
	const products = useSelector((store) => store.cart.products)

	const { selectedItems, totalPrice, tax, taxRate, grandTotal } = useSelector(
		(store) => store.cart
	)

	const handleClearCart = () => {
		dispatch(clearCart())
	}

	const makePayment = async (e) => {
		const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PK)
		const body = {
			products: products,
			userId: user?._id,
		}

		const headers = {
			'Content-Type': 'application/json',
		}

		const response = await fetch(
			`${getBaseUrl()}/api/orders/create-checkout-session`,
			{
				method: 'POST',
				headers: headers,
				body: JSON.stringify(body),
			}
		)

		const session = await response.json()
		console.log('session: ', session)

		const result = stripe.redirectToCheckout({
			sessionId: session.id,
		})

		console.log('Result:', result)

		if (result.error) {
			console.log('Error:', result.error)
		}
	}

	return (
		<div className='bg-primary-light mt-5 rounded text-base'>
			<div className='space-y-5 px-6 py-4'>
				<h2 className='text-text-dark text-xl'>Order Summary</h2>
				<p className='mt-2 text-text-dark'>SelectedItems: {selectedItems}</p>
				<p>Total Price: ${totalPrice.toFixed(2)}</p>
				<p>
					Tax ({taxRate * 100}%): ${tax.toFixed(2)}
				</p>
				<h3 className='font-bold'>GrandTotal: ${grandTotal.toFixed(2)}</h3>

				<div className='mb-6 px-4'>
					<button
						className='flex justify-between items-center bg-red-500 mt-2 mb-4 px-3 py-1.5 rounded-md text-white'
						onClick={(e) => {
							e.stopPropagation()
							handleClearCart()
						}}
					>
						<span className='mr-2'>Clear cart</span>
						<i className='ri-delete-bin-7-line'></i>
					</button>

					<button
						className='flex justify-between items-center bg-green-600 mt-2 px-3 py-1.5 rounded-md text-white'
						onClick={(e) => {
							e.stopPropagation()
							makePayment()
						}}
					>
						<span className='mr-2'>Proceed Checkout</span>
						<i className='ri-bank-card-line'></i>
					</button>
				</div>
			</div>
		</div>
	)
}
