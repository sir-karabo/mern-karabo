/* eslint-disable no-unused-vars */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { useAddProductMutation } from '../../../redux/features/productsApi'
import TextInput from './text-input'
import SelectInput from './select-input'
import UploadImage from './upload-image'

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

export default function AddProduct() {
	const [image, setImage] = useState('')
	const [product, setProduct] = useState({
		name: '',
		category: '',
		color: '',
		price: '',
		description: '',
	})

	const navigate = useNavigate()
	const { user } = useSelector((state) => state.auth)
	const [AddProduct, { isLoading, error }] = useAddProductMutation()

	const handleChange = (e) => {
		const { name, value } = e.target
		setProduct({
			...product,
			[name]: value,
		})
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (
			!product.name ||
			!product.category ||
			!product.price ||
			!product.description ||
			!product.color
		) {
			alert('Please fill all the required fields')
			return
		}

		try {
			await AddProduct({ ...product, image, author: user?._id }).unwrap()
			alert('Product added successfully')
			setProduct({
				name: '',
				category: '',
				color: '',
				price: '',
				description: '',
			})
			setImage('')
			navigate('/shop')
		} catch (error) {
			console.log('Failed to submit product', error)
		}
	}

	return (
		<div className='mx-auto mt-8 container'>
			<h2 className='mb-6 font-bold text-2xl'>Add New Product</h2>
			<form onSubmit={handleSubmit} className='space-y-4'>
				<TextInput
					label='Product Name'
					name='name'
					placeholder='Ex: Diamond Earings'
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
					value={(e) => setImage(e.target.value)}
					placeholder='Image'
					setImage={setImage}
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
						Add Product
					</button>
				</div>
			</form>
		</div>
	)
}
