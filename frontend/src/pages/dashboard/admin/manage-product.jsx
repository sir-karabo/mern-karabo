/* eslint-disable no-unused-vars */
import { useState } from 'react'
import { Link } from 'react-router-dom'

import {
	useDeleteProductMutation,
	useFetchAllProductsQuery,
} from '../../../redux/features/productsApi'
import { formatDate } from '../../../utils/format-date'

export default function ManageProduct() {
	const [currentPage, setCurrentPage] = useState(1)
	const [productsPerPage] = useState(12)

	const [deleteProduct] = useDeleteProductMutation()
	const {
		data: { products = [], totalPages, totalProducts } = {},
		isLoading,
		error,
		refetch,
	} = useFetchAllProductsQuery({
		category: '',
		color: '',
		minPrice: '',
		maxPrice: '',
		page: currentPage,
		limit: productsPerPage,
	})

	const handleDeleteProduct = async (id) => {
		try {
			const response = await deleteProduct(id).unwrap()
			alert('Product deleted successfully')
			await refetch()
		} catch (error) {
			console.error('Error deleting product', error)
		}
	}

	const handlePageChange = (pageNumber) => {
		if (pageNumber > 0 && pageNumber <= totalPages) {
			setCurrentPage(pageNumber)
		}
	}

	// pagination
	const startProduct = (currentPage - 1) * productsPerPage + 1
	const endProduct = startProduct + products.length - 1

	return (
		<>
			{isLoading && <div>Loading...</div>}
			{error && <div>Error loading products.</div>}
			<section className='bg-blueGray-50 py-1'>
				<div className='mx-auto mb-12 xl:mb-0 px-4 w-full'>
					<div className='relative flex flex-col bg-white shadow-lg mb-6 rounded w-full min-w-0 break-words'>
						<div className='border-0 mb-0 px-4 py-3 rounded-t'>
							<div className='flex flex-wrap items-center'>
								<div className='relative flex-grow flex-1 px-4 w-full max-w-full'>
									<h3 className='font-semibold text-base text-blueGray-700'>
										All Products
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
							<h3 className='my-4 text-sm'>
								Showing {startProduct} to {endProduct} of {totalProducts}{' '}
								products
							</h3>
						</div>

						<div className='block w-full overflow-x-auto'>
							<table className='items-center border-collapse bg-transparent w-full'>
								<thead>
									<tr>
										<th className='bg-blueGray-50 px-6 py-3 border border-r-0 border-blueGray-100 border-l-0 border-solid font-semibold text-blueGray-500 text-left text-xs uppercase whitespace-nowrap align-middle'>
											No.
										</th>
										<th className='bg-blueGray-50 px-6 py-3 border border-r-0 border-blueGray-100 border-l-0 border-solid font-semibold text-blueGray-500 text-left text-xs uppercase whitespace-nowrap align-middle'>
											Product Name
										</th>
										<th className='bg-blueGray-50 px-6 py-3 border border-r-0 border-blueGray-100 border-l-0 border-solid font-semibold text-blueGray-500 text-left text-xs uppercase whitespace-nowrap align-middle'>
											Publishing date
										</th>
										<th className='bg-blueGray-50 px-6 py-3 border border-r-0 border-blueGray-100 border-l-0 border-solid font-semibold text-blueGray-500 text-left text-xs uppercase whitespace-nowrap align-middle'>
											Edit Product
										</th>
										<th className='bg-blueGray-50 px-6 py-3 border border-r-0 border-blueGray-100 border-l-0 border-solid font-semibold text-blueGray-500 text-left text-xs uppercase whitespace-nowrap align-middle'>
											Delete Product
										</th>
									</tr>
								</thead>

								<tbody>
									{products &&
										products.map((product, index) => (
											<tr key={index}>
												<th className='px-6 p-4 border-t-0 border-r-0 border-l-0 text-blueGray-700 text-left text-xs whitespace-nowrap align-middle'>
													{index + 1}
												</th>
												<td className='px-6 p-4 border-t-0 border-r-0 border-l-0 text-xs whitespace-nowrap align-middle'>
													{product?.name}
												</td>
												<td className='px-6 p-4 border-t-0 border-r-0 border-l-0 text-xs whitespace-nowrap align-center'>
													{formatDate(product?.createdAt)}
												</td>
												<td className='px-6 p-4 border-t-0 border-r-0 border-l-0 text-xs hover:text-primary whitespace-nowrap cursor-pointer align-middle'>
													<Link to={`/dashboard/update-product/${product._id}`}>
														{' '}
														Edit
													</Link>
												</td>
												<td className='px-6 p-4 border-t-0 border-r-0 border-l-0 text-xs whitespace-nowrap align-middle'>
													<button
														onClick={() => handleDeleteProduct(product._id)}
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

				{/* pagination */}
				<div className='flex justify-center items-center mt-6'>
					<button
						disabled={currentPage === 1}
						onClick={() => handlePageChange(currentPage - 1)}
						className='bg-gray-300 mr-2 px-4 py-2 rounded-md text-gray-700'
					>
						Previous
					</button>
					{[...Array(totalPages)].map((_, index) => (
						<button
							key={index}
							onClick={() => handlePageChange(index + 1)}
							className={`px-4 py-2 ${
								currentPage === index + 1
									? 'bg-blue-500 text-white'
									: 'bg-gray-300 text-gray-700'
							} rounded-md mx-1`}
						>
							{index + 1}
						</button>
					))}
					<button
						disabled={currentPage === totalPages}
						onClick={() => handlePageChange(currentPage + 1)}
						className='bg-gray-300 ml-2 px-4 py-2 rounded-md text-gray-700'
					>
						Next
					</button>
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
		</>
	)
}
