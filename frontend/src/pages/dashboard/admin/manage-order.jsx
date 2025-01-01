/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { formatDate } from '../../../utils/format-date'
import {
	useDeleteOrderMutation,
	useGetAllOrdersQuery,
} from '../../../redux/features/ordersApi'
import UpdateOrderModal from './update-order-modal'

export default function ManageOrder() {
	const { data: orders, error, isLoading, refetch } = useGetAllOrdersQuery()
	const [selectedOrder, setSelectedOrder] = useState(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [deleteOrder] = useDeleteOrderMutation()

	const handleEditOrder = (order) => {
		setSelectedOrder(order)
		setIsModalOpen(true)
	}

	const handleCloseModal = () => {
		setIsModalOpen(false)
		setSelectedOrder(null)
	}

	const handleDeleteOder = async (orderId) => {
		try {
			await deleteOrder(orderId).unwrap()
			alert('Order deleted successfully')
			refetch()
		} catch (error) {
			console.error('Failed to delete order:', err)
		}
	}

	if (isLoading) return <div>Loading....</div>
	if (error) return <div>Something went wrong!</div>

	return (
		<div className='p-6 section__container'>
			<h2 className='mb-4 font-semibold text-2xl'>Manage Orders</h2>
			<table className='border-gray-200 bg-white border rounded-lg min-w-full'>
				<thead className='bg-gray-100'>
					<tr>
						<th className='px-4 py-3 border-b'>Order Id</th>
						<th className='px-4 py-3 border-b'>Customer</th>
						<th className='px-4 py-3 border-b'>Status</th>
						<th className='px-4 py-3 border-b'>Date</th>
						<th className='px-4 py-3 border-b'>Actions</th>
					</tr>
				</thead>

				<tbody>
					{orders &&
						orders.map((order, index) => (
							<tr key={index}>
								<td className='px-4 py-3 border-b'>{order?.orderId}</td>
								<td className='px-4 py-3 border-b'>{order?.email}</td>
								<td className='px-4 py-3 border-b'>
									<span
										className={`inline-block px-3 py-1 text-xs text-white rounded-full ${getStatusColor(
											order?.status
										)}`}
									>
										{order?.status}
									</span>
								</td>
								<td className='px-4 py-3 border-b'>
									{formatDate(order?.updatedAt)}
								</td>
								<td className='flex items-center space-x-4 px-4 py-3 border-b'>
									<Link to='#' className='text-blue-500 hover:underline'>
										View
									</Link>
									<button
										className='text-green-500 hover:underline'
										onClick={() => handleEditOrder(order)}
									>
										Edit
									</button>
									<button
										className='text-red-500 hover:underline'
										onClick={() => handleDeleteOder(order?._id)}
									>
										Delete
									</button>
								</td>
							</tr>
						))}
				</tbody>
			</table>

			{/* update order modal */}
			{selectedOrder && (
				<UpdateOrderModal
					order={selectedOrder}
					isOpen={isModalOpen}
					onClose={handleCloseModal}
				/>
			)}
		</div>
	)
}

const getStatusColor = (status) => {
	switch (status) {
		case 'pending':
			return 'bg-yellow-500'
		case 'processing':
			return 'bg-blue-500'
		case 'shipped':
			return 'bg-green-500'
		case 'completed':
			return 'bg-gray-500'
		default:
			return 'bg-gray-300'
	}
}
