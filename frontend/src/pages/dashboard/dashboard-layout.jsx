import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

import AdminDashboard from './admin-dashboard'
import UserDashboard from './user-dashboard'

export default function DashboardLayout() {
	const { user } = useSelector((state) => state.auth)

	if (!user) {
		return <Navigate to='/login' replace />
	}

	const renderDashboard = () => {
		switch (user?.role) {
			case 'admin':
				return <AdminDashboard />
			case 'user':
				return <UserDashboard />

			default:
				return <Navigate to='/login' replace />
		}
	}

	return (
		<div className='flex md:flex-row flex-col justify-start items-start gap-4 mx-auto container'>
			<header className='border w-full sm:w-2/5 lg:w-1/5'>
				{renderDashboard()}
			</header>
			<main className='bg-white mt-5 p-8 border w-full'>
				<Outlet />
			</main>
		</div>
	)
}
