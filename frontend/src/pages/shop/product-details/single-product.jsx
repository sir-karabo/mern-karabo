import { Link, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { addToCart } from '../../../redux/features/cartSlice'
import { useFetchProductByIdQuery } from '../../../redux/features/productsApi'
import RatingStars from '../../../components/rating-stars'
import ReviewsCard from '../reviews/reviews-card'

export default function SingleProduct() {
	const { id } = useParams()
	const dispatch = useDispatch()
	const { data, error, isLoading } = useFetchProductByIdQuery(id)

	const singleProduct = data?.product || {}
	const productReviews = data?.reviews || []

	const handleAddToCart = (product) => {
		dispatch(addToCart(product))
	}

	if (isLoading) return <p>Loading...</p>
	if (error) return <p>Error loading product details.</p>

	return (
		<>
			<section className='bg-primary-light section__container'>
				<h2 className='capitalize section__header'>Single Product Page</h2>
				<div className='space-x-2 section__subheader'>
					<span className='hover:text-primary'>
						<Link to='/'>home</Link>
					</span>
					<i className='ri-arrow-right-s-line'></i>
					<span className='hover:text-primary'>
						<Link to='/shop'>shop</Link>
					</span>
					<i className='ri-arrow-right-s-line'></i>
					<span className='hover:text-primary'>{singleProduct.name}</span>
				</div>
			</section>

			<section className='mt-8 section__container'>
				<div className='flex md:flex-row flex-col items-center gap-8'>
					{/* product image */}
					<div className='w-full md:w-1/2'>
						<img
							src={singleProduct?.image}
							alt=''
							className='rounded-md w-full h-auto'
						/>
					</div>

					<div className='w-full md:w-1/2'>
						<h3 className='mb-4 font-semibold text-2xl'>
							{singleProduct?.name}
						</h3>
						<p className='space-x-1 mb-4 text-primary text-xl'>
							${singleProduct?.price}
							{singleProduct?.oldPrice && (
								<s className='ml-1'>${singleProduct?.oldPrice}</s>
							)}
						</p>
						<p className='mb-4 text-green-600'>{singleProduct?.description}</p>

						{/* additional product info */}
						<div className='flex flex-col space-y-2'>
							<p>
								<strong>Category:</strong> {singleProduct?.category}
							</p>
							<p>
								<strong>Color:</strong> {singleProduct?.color}
							</p>
							<div className='flex items-center gap-1'>
								<strong>Rating: </strong>
								<RatingStars rating={singleProduct?.rating} />
							</div>
						</div>

						<button
							onClick={(e) => {
								e.stopPropagation()
								handleAddToCart(singleProduct)
							}}
							className='bg-primary mt-6 px-6 py-3 rounded-md text-white'
						>
							Add to Cart
						</button>
					</div>
				</div>
			</section>

			{/* display Reviews */}
			<section className='mt-8 section__container'>
				<ReviewsCard productReviews={productReviews} />
			</section>
		</>
	)
}
