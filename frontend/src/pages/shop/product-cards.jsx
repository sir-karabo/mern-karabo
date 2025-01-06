/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { addToCart } from '../../redux/features/cartSlice'
import RatingStars from '../../components/rating-stars'

export default function ProductCards({ products }) {
	const dispatch = useDispatch()

	const handleAddToCart = (product) => {
		dispatch(addToCart(product))
	}

	return (
		<div className='gap-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
			{products.map((product, index) => (
				<div key={index} className='product__card'>
					<div className='relative'>
						<Link to={`/shop/${product._id}`}>
							<img
								src={product.image}
								alt='product image'
								className='w-full md:h-64 max-h-96 transition-all duration-300 hover:scale-105 object-cover'
							/>
						</Link>

						<div className='hover:block top-3 right-3 absolute'>
							<button>
								<i
									className='bg-primary hover:bg-primary-dark p-1.5 text-white ri-shopping-cart-2-line'
									onClick={(e) => {
										e.stopPropagation()
										handleAddToCart(product)
									}}
								></i>
							</button>
						</div>
					</div>

					{/* product description */}
					<div className='product__card__content'>
						<h4>{product.name}</h4>
						<p>
							${product.price}{' '}
							{product?.oldPrice ? <s>${product?.oldPrice}</s> : null}
						</p>
						<RatingStars rating={product.rating} />
					</div>
				</div>
			))}
		</div>
	)
}
