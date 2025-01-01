import { Outlet } from 'react-router-dom'
import './App.css'
import Navbar from './components/navbar'
import Footer from './components/footer'

export default function App() {
	return (
		<>
			<Navbar />
			<Outlet />
			<Footer />
		</>
	)
}
