import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { useGetReviewsByUserIdQuery } from '../../../redux/features/reviewsApi'

export default function UserReviews() {
	const { user } = useSelector((state) => state.auth)
	const {
		data: reviews,
		error,
		isLoading,
	} = useGetReviewsByUserIdQuery(user?._id)

	const navigate = useNavigate()

	if (isLoading) return <div>Loading...</div>
	if (error) return <div>Failed to load reviews!</div>

	const handleCardClick = () => {
		navigate('/shop')
	}

	return (
		<div className='py-6'>
			<h2 className='mb-8" font-bold text-2xl'>Your given Reviews</h2>
			<div className='gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-8'>
				{reviews &&
					reviews.map((review, index) => (
						<div
							key={index}
							className='border-gray-200 bg-white shadow-md p-4 rounded-lg transition-all duration-200 cursor-pointer hover:scale-105'
						>
							<p className='mb-2 font-semibold text-lg'>
								Rating: {review?.rating}
							</p>
							<p className='mb-2'>
								<strong>Comment:</strong> {review?.comment}
							</p>
							<p className='text-gray-500 text-sm'>
								<strong>ProductId:</strong> {review?.productId}
							</p>
							<p className='text-gray-500 text-sm'>
								<strong>Date:</strong>{' '}
								{new Date(review?.createdAt).toLocaleDateString()}
							</p>
						</div>
					))}
				<div
					onClick={handleCardClick}
					className='flex justify-center items-center bg-gray-100 hover:bg-primary p-6 border rounded-lg text-black hover:text-white transition-all duration-200 cursor-pointer'
				>
					<span>+</span>
					<p>Add New Review</p>
				</div>
			</div>
		</div>
	)
}
