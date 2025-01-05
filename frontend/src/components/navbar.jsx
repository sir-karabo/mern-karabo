import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import avatarImg from '../assets/avatar.png'
import { useLogoutUserMutation } from '../redux/features/auth/authApi'

import CartModal from '../pages/shop/cart-modal'
import { logout } from '../redux/features/auth/authSlice'

export default function Navbar() {
	const navigate = useNavigate()
	const { user } = useSelector((state) => state.auth)
	const products = useSelector((state) => state.cart.products)
	const dispatch = useDispatch()
	const [logoutUser] = useLogoutUserMutation()

	const [isCartOpen, setisCartOpen] = useState(false)
	const [isDropDownOpen, setIsDropDownOpen] = useState(false)

	const adminDropDownMenus = [
		{ label: 'Dashboard', path: '/dashboard/admin' },
		{ label: 'Add Product', path: '/dashboard/add-product' },
		{ label: 'Manage Products', path: '/dashboard/manage-products' },
		{ label: 'Manage Orders', path: '/dashboard/manage-orders' },
		{ label: 'Manage Users', path: '/dashboard/manage-users' },
	]

	const userDropDownMenus = [
		{ label: 'Dashboard', path: '/dashboard' },
		{ label: 'Orders', path: '/dashboard/orders' },
		{ label: 'Payments', path: '/dashboard/payments' },
		{ label: 'Profile', path: '/dashboard/profile' },
	]

	const dropdownMenus =
		user?.role === 'admin' ? [...adminDropDownMenus] : [...userDropDownMenus]

	const handleCartToggle = () => {
		setisCartOpen(!isCartOpen)
	}

	const handDropDownToggle = () => {
		setIsDropDownOpen(!isDropDownOpen)
	}

	const handleLogout = async () => {
		try {
			await logoutUser().unwrap()
			dispatch(logout())
			navigate('/')
		} catch (error) {
			console.error('Failed to log out', error)
		}
	}

	console.table(products)

	return (
		<header className='fixed-nav-bar w-nav'>
			<nav className='flex justify-between items-center mx-auto px-4 max-w-screen-2xl'>
				<ul className='nav__links'>
					<li className='link'>
						<Link to='/'>Home</Link>
					</li>
					<li className='link'>
						<Link to='/shop'>Shop</Link>
					</li>
					<li className='link'>
						<Link to='/contact'>Contact</Link>
					</li>
				</ul>

				{/* logo */}
				<div className='nav__logo'>
					<Link to='/'>
						The Green Republic<span>.</span>
					</Link>
				</div>

				{/* nav icons */}
				<div className='relative nav__icons'>
					<span>
						<Link to='/search'>
							<i className='ri-search-line'></i>
						</Link>
					</span>
					<span>
						<button className='hover:text-primary' onClick={handleCartToggle}>
							<i className='ri-shopping-bag-line'></i>
							<sup className='inline-block bg-primary px-1.5 rounded-full text-center text-sm text-white'>
								{products.length}
							</sup>
						</button>
					</span>
					<span>
						{user && user ? (
							<>
								<img
									src={user?.profileImage || avatarImg}
									alt='Members'
									className='rounded-full cursor-pointer size-6'
									onClick={handDropDownToggle}
								/>

								{isDropDownOpen && (
									<div className='right-0 z-50 absolute border-gray-200 bg-white shadow-lg mt-3 p-4 border rounded-lg w-48'>
										<ul className='space-y-4 p-2 font-medium'>
											{dropdownMenus.map((menu, index) => (
												<li key={index}>
													<Link
														onClick={() => setIsDropDownOpen(false)}
														className='dropdown-items'
														to={menu.path}
													>
														{menu.label}
													</Link>
												</li>
											))}
											<li>
												<Link onClick={handleLogout} className='dropdown-items'>
													Logout
												</Link>
											</li>
										</ul>
									</div>
								)}
							</>
						) : (
							<Link to='login'>
								<i className='ri-user-line'></i>
							</Link>
						)}
					</span>
				</div>
			</nav>
			{isCartOpen && (
				<CartModal
					products={products}
					isOpen={isCartOpen}
					onClose={handleCartToggle}
				/>
			)}
		</header>
	)
}
