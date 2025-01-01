/* eslint-disable no-unused-vars */
import { useState } from 'react'

import {
	useDeleteUserMutation,
	useGetUserQuery,
} from '../../../redux/features/auth/authApi'
import UpdateUserModal from './update-user-modal'

export default function ManageUser() {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [selectedUser, setSelectedUser] = useState(null)
	const { data: users = [], error, isLoading, refetch } = useGetUserQuery()

	console.log(users)

	const [deleteUser] = useDeleteUserMutation()

	const handleDelete = async (id) => {
		try {
			const response = await deleteUser(id).unwrap()
			alert('User deleted successfully!')
			refetch()
		} catch (error) {
			console.error('Failed to delete user', error)
		}
	}

	const handleEdit = (user) => {
		setSelectedUser(user)
		setIsModalOpen(true)
	}

	const handleCloseModal = () => {
		setIsModalOpen(false)
		setSelectedUser(null)
	}
	return (
		<>
			{isLoading && <div>Loading...</div>}
			{error && <div>Error loading users data.</div>}
			<section className='bg-blueGray-50 py-1'>
				<div className='mx-auto mb-12 xl:mb-0 px-4 w-full'>
					<div className='relative flex flex-col bg-white shadow-lg mb-6 rounded w-full min-w-0 break-words'>
						<div className='border-0 mb-0 px-4 py-3 rounded-t'>
							<div className='flex flex-wrap items-center'>
								<div className='relative flex-grow flex-1 px-4 w-full max-w-full'>
									<h3 className='font-semibold text-base text-blueGray-700'>
										All Users
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
											No.
										</th>
										<th className='bg-blueGray-50 px-6 py-3 border border-r-0 border-blueGray-100 border-l-0 border-solid font-semibold text-blueGray-500 text-left text-xs uppercase whitespace-nowrap align-middle'>
											User email
										</th>
										<th className='bg-blueGray-50 px-6 py-3 border border-r-0 border-blueGray-100 border-l-0 border-solid font-semibold text-blueGray-500 text-left text-xs uppercase whitespace-nowrap align-middle'>
											User role
										</th>
										<th className='bg-blueGray-50 px-6 py-3 border border-r-0 border-blueGray-100 border-l-0 border-solid font-semibold text-blueGray-500 text-left text-xs uppercase whitespace-nowrap align-middle'>
											Edit user
										</th>
										<th className='bg-blueGray-50 px-6 py-3 border border-r-0 border-blueGray-100 border-l-0 border-solid font-semibold text-blueGray-500 text-left text-xs uppercase whitespace-nowrap align-middle'>
											Delete user
										</th>
									</tr>
								</thead>

								<tbody>
									{users &&
										users.map((user, index) => (
											<tr key={index}>
												<th className='px-6 p-4 border-t-0 border-r-0 border-l-0 text-blueGray-700 text-left text-xs whitespace-nowrap align-middle'>
													{index + 1}
												</th>
												<td className='px-6 p-4 border-t-0 border-r-0 border-l-0 text-xs whitespace-nowrap align-middle'>
													{user?.email || 'N/A'}
												</td>
												<td className='px-6 p-4 border-t-0 border-r-0 border-l-0 text-xs whitespace-nowrap align-center'>
													<span
														className={`rounded-full py-[2px] px-3 ${user?.role === 'admin'
															? 'bg-indigo-500 text-white '
															: 'bg-amber-300'
															}`}
													>
														{' '}
														{user?.role}
													</span>
												</td>
												<td className='px-6 p-4 border-t-0 border-r-0 border-l-0 text-xs hover:text-primary whitespace-nowrap cursor-pointer align-middle'>
													<button
														onClick={() => handleEdit(user)}
														className='flex items-center gap-1 hover:text-red-500'
													>
														<i className='ri-edit-2-line'></i>
														Edit
													</button>
												</td>
												<td className='px-6 p-4 border-t-0 border-r-0 border-l-0 text-xs whitespace-nowrap align-middle'>
													<button
														onClick={() => handleDelete(user?._id)}
														className='bg-red-600 px-2 py-1 text-white'
													>
														Delete
													</button>
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

			{isModalOpen && (
				<UpdateUserModal
					user={selectedUser}
					onClose={handleCloseModal}
					onRoleUpdate={refetch}
				/>
			)}
		</>
	)
}
