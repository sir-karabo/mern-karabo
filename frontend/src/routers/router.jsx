import { createBrowserRouter } from 'react-router-dom'

import App from '../App'
import RegisterPage from '../components/register'
import LoginPage from '../components/login'
import HomePage from '../pages/home/home'
import CategoryPage from '../pages/category/category'
import SearchPage from '../pages/search/Search'
import ShopPage from '../pages/shop/shop'
import SingleProduct from '../pages/shop/product-details/single-product'
import PaymentSuccess from '../components/payment-success'
import OrderDetails from '../pages/dashboard/user/order-details'
import PrivateRoute from './private-route'
import DashboardLayout from '../pages/dashboard/dashboard-layout'
import UserDMain from '../pages/dashboard/user/dashboard/user-d-main'
import UserOrders from '../pages/dashboard/user/user-orders'
import UserPayments from '../pages/dashboard/user/user-payments'
import UserReviews from '../pages/dashboard/user/user-reviews'
import UserProfile from '../pages/dashboard/user/user-profile'
import AdminDMain from '../pages/dashboard/admin/dashboard/admin-d-main'
import AddProduct from '../pages/dashboard/admin/add-product'
import ManageProduct from '../pages/dashboard/admin/manage-product'
import UpdateProduct from '../pages/dashboard/admin/dashboard/update-product'
import ManageOrder from '../pages/dashboard/admin/manage-order'
import ManageUser from '../pages/dashboard/admin/manage-user'

const router = createBrowserRouter([
	{
		path: '/register',
		element: <RegisterPage />,
	},
	{
		path: '/login',
		element: <LoginPage />,
	},
	{
		path: '/',
		element: <App />,
		children: [
			{ path: '/', element: <HomePage /> },
			{ path: '/categories/:categoryName', element: <CategoryPage /> },
			{ path: '/search', element: <SearchPage /> },
			{ path: '/shop', element: <ShopPage /> },
			{ path: '/shop/:id', element: <SingleProduct /> },
			{
				path: '/success',
				element: <PaymentSuccess />,
			},
			{
				path: '/orders/:orderId',
				element: <OrderDetails />,
			},
		],
	},

	{
		path: '/dashboard',
		element: (
			<PrivateRoute>
				<DashboardLayout />
			</PrivateRoute>
		),
		children: [
			// user dashboard routes
			{ path: '', element: <UserDMain /> },
			{ path: 'orders', element: <UserOrders /> },
			{ path: 'payments', element: <UserPayments /> },
			{ path: 'reviews', element: <UserReviews /> },
			{ path: 'profile', element: <UserProfile /> },

			// admin dashboard routes
			{
				path: 'admin',
				element: (
					<PrivateRoute role='admin'>
						<AdminDMain />
					</PrivateRoute>
				),
			},
			{
				path: 'add-product',
				element: (
					<PrivateRoute role='admin'>
						<AddProduct />
					</PrivateRoute>
				),
			},
			{
				path: 'manage-products',
				element: (
					<PrivateRoute role='admin'>
						<ManageProduct />
					</PrivateRoute>
				),
			},
			{
				path: 'update-product/:id',
				element: (
					<PrivateRoute role='admin'>
						<UpdateProduct />
					</PrivateRoute>
				),
			},
			{
				path: 'manage-orders',
				element: (
					<PrivateRoute role='admin'>
						<ManageOrder />
					</PrivateRoute>
				),
			},
			{
				path: 'manage-users',
				element: (
					<PrivateRoute role='admin'>
						<ManageUser />
					</PrivateRoute>
				),
			},
		],
	},
])

export default router
