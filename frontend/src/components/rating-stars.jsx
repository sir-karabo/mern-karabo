/* eslint-disable react/prop-types */
export default function RatingStars({ rating }) {
	const stars = []
	for (let i = 1; i <= 5; i++) {
		stars.push(
			<span
				key={i}
				className={`ri-star${i <= rating ? '-fill' : '-line'}`}
			></span>
		)
	}
	return <div className='product__rating'>{stars}</div>
}
