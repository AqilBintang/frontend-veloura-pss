import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '../pages/Home'
import Reserve from '../pages/Reserve'
import Booking from '../pages/Booking'
import Profile from '../pages/Profile'
import Orders from '../pages/Orders'
import Login from '../pages/Login'
import Layout from '../layout/Layout'
import PageTransition from '../components/PageTransition'
import { isLoggedIn } from '../auth'

// Guard — redirect ke /login jika belum login
const PrivateRoute = ({ element }) => {
    return isLoggedIn() ? element : <Navigate to="/login" replace />
}

const IndexRoutes = () => {
    return (
        <PageTransition>
            <Routes>

                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="reserve" element={<Reserve />} />
                </Route>

                {/* Route yang butuh login */}
                <Route path="/profile"               element={<PrivateRoute element={<Profile />} />} />
                <Route path="/orders"                element={<PrivateRoute element={<Orders />} />} />
                <Route path="/reserve/booking/:pkg"  element={<PrivateRoute element={<Booking />} />} />

                <Route path="/login" element={<Login />} />

            </Routes>
        </PageTransition>
    )
}

export default IndexRoutes
