/* eslint-disable react/prop-types */
import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function PrivateRoute({ children, role }) {
	const location = useLocation()
	const { user } = useSelector((state) => state.auth)

	if (!user) {
		alert('You must be logged in!')
		return <Navigate to='/login' state={{ from: location }} replace />
	}

	if (role && user.role !== role) {
		alert('You are not authorized to access this page!')
		return <Navigate to='/login' state={{ from: location }} replace />
	}

	return children
}
