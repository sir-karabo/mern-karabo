/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import {
	useFetchProductByIdQuery,
	useUpdateProductMutation,
} from '../../../../redux/features/productsApi'
import TextInput from '../text-input'
import SelectInput from '../select-input'
import UploadImage from '../upload-image'

const categories = [
	{ label: 'Select Category', value: '' },
	{ label: 'Accessories', value: 'accessories' },
	{ label: 'Dress', value: 'dress' },
	{ label: 'Jewellery', value: 'jewellery' },
	{ label: 'Cosmetics', value: 'cosmetics' },
]

const colors = [
	{ label: 'Select Color', value: '' },
	{ label: 'Black', value: 'black' },
	{ label: 'Red', value: 'red' },
	{ label: 'Gold', value: 'gold' },
	{ label: 'Blue', value: 'blue' },
	{ label: 'Silver', value: 'silver' },
	{ label: 'Beige', value: 'beige' },
	{ label: 'Green', value: 'green' },
]

export default function UpdateProduct() {
	const [newImage, setNewImage] = useState(null)
	const [product, setProduct] = useState({
		name: '',
		category: '',
		color: '',
		price: '',
		description: '',
		image: '',
	})

	const { id } = useParams()
	const navigate = useNavigate()
	const { user } = useSelector((state) => state.auth)

	const {
		data: productData,
		isLoading: isProductLoading,
		error: fetchError,
		refetch,
	} = useFetchProductByIdQuery(id)

	const {
		name,
		category,
		color,
		description,
		image: imageURL,
		price,
	} = productData?.product || {}

	const [updateProduct, { isLoading: isUpdating, error: updateError }] =
		useUpdateProductMutation()

	useEffect(() => {
		if (productData) {
			setProduct({
				name: name || '',
				category: category || '',
				color: color || '',
				price: price || '',
				description: description || '',
				image: imageURL || '',
			})
		}
	}, [productData])

	const handleChange = (e) => {
		const { name, value } = e.target
		setProduct({
			...product,
			[name]: value,
		})
	}

	const handleImageChange = (image) => {
		setNewImage(image)
	}

	const handleSubmit = async (e) => {
		e.preventDefault()

		const updatedProduct = {
			...product,
			image: newImage ? newImage : product.image,
			author: user?._id,
		}

		try {
			await updateProduct({ id: id, ...updatedProduct }).unwrap()
			alert('Product updated successfully')
			await refetch()
			navigate('/dashboard/manage-products')
		} catch (error) {
			console.error('Failed to update product:', error)
		}
	}

	if (isProductLoading) return <div>Loading....</div>
	if (fetchError) return <div>Error fetching products!...</div>

	return (
		<div className='mx-auto mt-8 container'>
			<h2 className='mb-6 font-bold text-2xl'>Update Product </h2>
			<form onSubmit={handleSubmit} className='space-y-4'>
				<TextInput
					label='Product Name'
					name='name'
					placeholder='Ex: Diamond Earrings'
					value={product.name}
					onChange={handleChange}
				/>
				<SelectInput
					label='Category'
					name='category'
					value={product.category}
					onChange={handleChange}
					options={categories}
				/>
				<SelectInput
					label='Color'
					name='color'
					value={product.color}
					onChange={handleChange}
					options={colors}
				/>
				<TextInput
					label='Price'
					name='price'
					type='number'
					placeholder='50'
					value={product.price}
					onChange={handleChange}
				/>

				<UploadImage
					name='image'
					id='image'
					value={newImage || product.image}
					placeholder='Image'
					setImage={handleImageChange}
				/>
				<div>
					<label
						htmlFor='description'
						className='block font-medium text-gray-700 text-sm'
					>
						Description
					</label>
					<textarea
						name='description'
						id='description'
						className='add-product-InputCSS'
						value={product.description}
						placeholder='Write a product description'
						onChange={handleChange}
					></textarea>
				</div>

				<div>
					<button type='submit' className='add-product-btn'>
						{isUpdating ? 'Updating...' : 'Update Product'}
					</button>
				</div>
			</form>
		</div>
	)
}
