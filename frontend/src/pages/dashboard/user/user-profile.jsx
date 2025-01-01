/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import avatarImg from '../../../assets/avatar.png'
import { useEditProfileMutation } from '../../../redux/features/auth/authApi'
import { setUser } from '../../../redux/features/auth/authSlice'

export default function UserProfile() {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [formData, setformData] = useState({
		username: '',
		profileImage: '',
		bio: '',
		profession: '',
		userId: '',
	})

	const dispatch = useDispatch()
	const { user } = useSelector((state) => state.auth)
	const [editProfile, { isLoading, isError, error, isSuccess }] =
		useEditProfileMutation()

	useEffect(() => {
		if (user) {
			setformData({
				username: user?.username || '',
				profileImage: user?.profileImage || '',
				bio: user?.bio || '',
				profession: user?.profession || '',
				userId: user?._id || '',
			})
		}
	}, [user])

	const handleChange = (e) => {
		setformData({
			...formData,
			[e.target.name]: e.target.value,
		})
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		const updatedUser = {
			username: formData.username,
			profileImage: formData.profileImage,
			bio: formData.bio,
			profession: formData.profession,
			userId: formData.userId,
		}
		try {
			const response = await editProfile(updatedUser).unwrap()
			console.log(response)
			dispatch(setUser(response.user))
			localStorage.setItem('user', JSON.stringify(response.user))
			alert('Profile updated successfully!')
		} catch (error) {
			console.error('Failed to update profile', error)
			alert('Failed to update profile. Please try again')
		}

		setIsModalOpen(false)
	}

	return (
		<div className='mx-auto p-6 container'>
			<div className='bg-white shadow-md p-6 rounded-lg'>
				<div className='flex items-center mb-4'>
					<img
						src={formData?.profileImage || avatarImg}
						alt=''
						className='rounded-full w-32 h-32 object-cover'
					/>
					<div className='ml-6'>
						<h3 className='font-semibold text-2xl'>
							Username: {formData?.username || 'N/A'}
						</h3>
						<p className='text-gray-700'>User Bio: {formData.bio || 'N/A'}</p>
						<p className='text-gray-700'>
							Profession: {formData.profession || 'N/A'}
						</p>
					</div>
					<button
						onClick={() => setIsModalOpen(true)}
						className='ml-auto text-blue-500 hover:text-blue-700'
					>
						<svg
							className='w-6 h-6'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2'
								d='M11 3H4a1 1 0 00-1 1v14a1 1 0 001 1h7m2 0h7a1 1 0 001-1V4a1 1 0 00-1-1h-7m-2 0v14'
							></path>
						</svg>
					</button>
				</div>
			</div>

			{/* show modal */}
			{isModalOpen && (
				<div className='z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-90'>
					<div className='relative bg-white mx-auto p-6 rounded-lg md:w-96 max-w-xl'>
						<button
							onClick={() => setIsModalOpen(false)}
							className='top-2 right-2 absolute text-gray-500 hover:text-gray-700'
						>
							<i className='bg-black p-2 rounded-full ri-close-line size-8'></i>
						</button>
						<h2 className='mb-4 font-bold text-2xl'>Edit Profile</h2>
						<form onSubmit={handleSubmit}>
							<div className='mb-4'>
								<label
									htmlFor='username'
									className='block font-medium text-gray-700 text-sm'
								>
									Username
								</label>
								<input
									type='text'
									name='username'
									value={formData?.username}
									onChange={handleChange}
									placeholder='username'
									className='border-gray-300 shadow-sm mt-1 p-2 border rounded-md w-full'
									required
								/>
							</div>
							<div className='mb-4'>
								<label
									htmlFor='profileImage'
									className='block font-medium text-gray-700 text-sm'
								>
									Profile Image Url
								</label>
								<input
									type='text'
									name='profileImage'
									value={formData?.profileImage}
									onChange={handleChange}
									placeholder='profileImage url'
									className='border-gray-300 shadow-sm mt-1 p-2 border rounded-md w-full'
									required
								/>
							</div>
							<div className='mb-4'>
								<label
									htmlFor='bio'
									className='block font-medium text-gray-700 text-sm'
								>
									Write Your Bio
								</label>
								<textarea
									name='bio'
									row='3'
									className='border-gray-300 shadow-sm mt-1 p-2 border rounded-md w-full'
									value={formData?.bio}
									onChange={handleChange}
									placeholder='add your bio'
								></textarea>
							</div>
							<div className='mb-4'>
								<label
									htmlFor='profession'
									className='block font-medium text-gray-700 text-sm'
								>
									Profession
								</label>
								<input
									type='text'
									name='profession'
									value={formData?.profession}
									onChange={handleChange}
									placeholder='profession'
									className='border-gray-300 shadow-sm mt-1 p-2 border rounded-md w-full'
									required
								/>
							</div>
							<button
								className={`mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
									}`}
								type='submit'
								disabled={isLoading}
							>
								{isLoading ? 'Saving...' : 'Save Changes'}
							</button>
							{isError && (
								<p className='mt-2 text-red-500'>
									Failed to update profile. Please try again
								</p>
							)}
							{isSuccess && (
								<p className='mt-2 text-green-500'>
									Profile updated successfully!
								</p>
							)}
						</form>
					</div>
				</div>
			)}
		</div>
	)
}
