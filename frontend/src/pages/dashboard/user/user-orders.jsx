import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { useGetOrdersByEmailQuery } from '../../../redux/features/ordersApi'

export default function UserOrders() {
	const { user } = useSelector((state) => state.auth)
	const {
		data: orderdata,
		error,
		isLoading,
	} = useGetOrdersByEmailQuery(user?.email)

	const orders = orderdata?.orders

	if (isLoading) return <div>Loading...</div>
	if (error) return <div>No order found!</div>

	console.log(orders)

	return (
		<section className='bg-blueGray-50 py-1'>
			<div className='mx-auto mb-12 xl:mb-0 px-4 w-full'>
				<div className='relative flex flex-col bg-white shadow-lg mb-6 rounded w-full min-w-0 break-words'>
					<div className='border-0 mb-0 px-4 py-3 rounded-t'>
						<div className='flex flex-wrap items-center'>
							<div className='relative flex-grow flex-1 px-4 w-full max-w-full'>
								<h3 className='font-semibold text-base text-blueGray-700'>
									Your Orders
								</h3>
							</div>
							<div className='relative text-right flex-grow flex-1 px-4 w-full max-w-full'>
								<button
									className='bg-indigo-500 active:bg-indigo-600 mr-1 mb-1 px-3 py-1 rounded font-bold text-white text-xs uppercase transition-all duration-150 ease-linear focus:outline-none outline-none'
									type='button'
								>
									See all
								</button>
							</div>
						</div>
					</div>

					<div className='block w-full overflow-x-auto'>
						<table className='items-center border-collapse bg-transparent w-full'>
							<thead>
								<tr>
									<th className='bg-blueGray-50 px-6 py-3 border border-r-0 border-blueGray-100 border-l-0 border-solid font-semibold text-blueGray-500 text-left text-xs uppercase whitespace-nowrap align-middle'>
										#
									</th>
									<th className='bg-blueGray-50 px-6 py-3 border border-r-0 border-blueGray-100 border-l-0 border-solid font-semibold text-blueGray-500 text-left text-xs uppercase whitespace-nowrap align-middle'>
										Order ID
									</th>
									<th className='bg-blueGray-50 px-6 py-3 border border-r-0 border-blueGray-100 border-l-0 border-solid font-semibold text-blueGray-500 text-left text-xs uppercase whitespace-nowrap align-middle'>
										Date
									</th>
									<th className='bg-blueGray-50 px-6 py-3 border border-r-0 border-blueGray-100 border-l-0 border-solid font-semibold text-blueGray-500 text-left text-xs uppercase whitespace-nowrap align-middle'>
										Status
									</th>
									<th className='bg-blueGray-50 px-6 py-3 border border-r-0 border-blueGray-100 border-l-0 border-solid font-semibold text-blueGray-500 text-left text-xs uppercase whitespace-nowrap align-middle'>
										Total
									</th>
									<th className='bg-blueGray-50 px-6 py-3 border border-r-0 border-blueGray-100 border-l-0 border-solid font-semibold text-blueGray-500 text-left text-xs uppercase whitespace-nowrap align-middle'>
										View Order
									</th>
								</tr>
							</thead>

							<tbody>
								{orders &&
									orders.map((order, index) => (
										<tr key={index}>
											<th className='px-6 p-4 border-t-0 border-r-0 border-l-0 text-blueGray-700 text-left text-xs whitespace-nowrap align-middle'>
												{index + 1}
											</th>
											<td className='px-6 p-4 border-t-0 border-r-0 border-l-0 text-xs whitespace-nowrap align-middle'>
												{order?.orderId}
											</td>
											<td className='px-6 p-4 border-t-0 border-r-0 border-l-0 text-xs whitespace-nowrap align-center'>
												{new Date(order?.createdAt).toLocaleDateString()}
											</td>
											<td className='px-6 p-4 border-t-0 border-r-0 border-l-0 text-xs whitespace-nowrap align-middle'>
												<span
													className={`p-1 rounded 
                                            ${order?.status === 'completed'
															? 'bg-green-100 text-green-700'
															: order?.status === 'pending'
																? 'bg-red-100 text-red-700'
																: order?.status === 'processing'
																	? 'bg-blue-100 text-blue-600'
																	: 'bg-indigo-100 text-indigo-600'
														}`}
												>
													{order?.status}
												</span>
											</td>
											<td className='px-6 p-4 border-t-0 border-r-0 border-l-0 text-xs whitespace-nowrap align-middle'>
												{order?.amount}
											</td>
											<td className='px-6 p-4 border-t-0 border-r-0 border-l-0 text-xs whitespace-nowrap align-middle'>
												<Link
													to={`/orders/${order?._id}`}
													className='hover:text-primary underline'
												>
													view order
												</Link>
											</td>
										</tr>
									))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<footer className='relative mt-16 pt-8 pb-6'>
				<div className='mx-auto px-4 container'>
					<div className='flex flex-wrap justify-center md:justify-between items-center'>
						<div className='mx-auto px-4 w-full md:w-6/12 text-center'>
							<div className='py-1 font-semibold text-blueGray-500 text-sm'>
								Made with{' '}
								<a
									href='https://www.creative-tim.com/product/notus-js'
									className='text-blueGray-500 hover:text-gray-800'
									target='_blank'
								>
									Notus JS
								</a>{' '}
								by{' '}
								<a
									href='https://www.creative-tim.com'
									className='text-blueGray-500 hover:text-blueGray-800'
									target='_blank'
								>
									{' '}
									Creative Tim
								</a>
								.
							</div>
						</div>
					</div>
				</div>
			</footer>
		</section>
	)
}
