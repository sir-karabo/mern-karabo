/* eslint-disable react/prop-types */
import { useDispatch } from 'react-redux'

import { removeFromCart, updateQuantity } from '../../redux/features/cartSlice'
import OrderSummary from './order-summary'

export default function CartModal({ products, isOpen, onClose }) {
	const dispatch = useDispatch()

	const handleQuantity = (type, id) => {
		const payload = { type, id }
		dispatch(updateQuantity(payload))
	}

	const handleRemove = (e, id) => {
		e.preventDefault()
		dispatch(removeFromCart({ id }))
	}

	return (
		<div
			className={`fixed z-[1000] inset-0 bg-black bg-opacity-80 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
				}`}
			style={{ transition: 'opacity 300ms' }}
		>
			<div
				className={`fixed right-0 top-0 md:w-1/3 w-full bg-white h-full overflow-y-auto transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'
					}`}
				style={{
					transition: 'transform 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94',
				}}
			>
				<div className='mt-4 p-4'>
					<div className='flex justify-between items-center mb-4'>
						<h4 className='font-semibold text-xl'>Your Cart</h4>
						<button
							className='text-gray-600 hover:text-gray-900'
							onClick={() => onClose()}
						>
							<i className='bg-black p-1 ri-xrp-fill text-white'></i>
						</button>
					</div>

					{/* cart details */}
					<div className='cart-items'>
						{products.length === 0 ? (
							<div>Your cart is empty</div>
						) : (
							products.map((item, index) => (
								<div
									key={index}
									className='flex md:flex-row flex-col md:justify-between md:items-center shadow-md mb-4 p-2 md:p-5'
								>
									<div className='flex items-center'>
										<span className='bg-primary mr-4 px-1 rounded-full text-white'>
											0{index + 1}
										</span>
										<img
											src={item.image}
											alt=''
											className='mr-4 object-cover size-12'
										/>
										<div>
											<h5 className='font-medium text-lg'>{item.name}</h5>
											<p className='text-gray-600 text-sm'>
												${Number(item.price).toFixed(2)}
											</p>
										</div>

										<div className='flex flex-row justify-end md:justify-start items-center mt-2'>
											<button
												className='flex justify-center items-center bg-gray-200 hover:bg-primary ml-8 px-1.5 rounded-full text-gray-700 hover:text-white size-6'
												onClick={() => handleQuantity('decrement', item._id)}
											>
												-
											</button>
											<span className='mx-1 px-2 text-center'>
												{item.quantity}
											</span>
											<button
												className='flex justify-center items-center bg-gray-200 hover:bg-primary px-1.5 rounded-full text-gray-700 hover:text-white size-6'
												onClick={() => handleQuantity('increment', item._id)}
											>
												+
											</button>
											<div className='ml-5'>
												<button
													className='mr-4 text-red-500 hover:text-red-800'
													onClick={(e) => handleRemove(e, item._id)}
												>
													Remove
												</button>
											</div>
										</div>
									</div>
								</div>
							))
						)}
					</div>
					{/* calculation */}
					{products.length > 0 && <OrderSummary />}
				</div>
			</div>
		</div>
	)
}
