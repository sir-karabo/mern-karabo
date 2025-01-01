import { useSelector } from 'react-redux'
import { useGetAdminStatsQuery } from '../../../../redux/features/statsApi'
import AdminStats from './admin-stats'
import AdminStatsChart from './admin-stats-chart'

export default function AdminDMain() {
	const { user } = useSelector((state) => state.auth)
	const { data: stats, error, isLoading } = useGetAdminStatsQuery()

	if (isLoading) return <div>Loading...</div>
	if (!stats) return <div>No stats found</div>
	if (error) return <div>Failed to load stats!</div>

	return (
		<div className='p-6'>
			<div>
				<h1 className='mb-4 font-semibold text-2xl'>Admin Dashboard</h1>
				<p className='text-gray-500'>
					Hi, {user?.username}! Welcome to the admin dashboard.
				</p>

				<AdminStats stats={stats} />
				<AdminStatsChart stats={stats} />
			</div>
		</div>
	)
}
