import { Routes, Route } from 'react-router-dom'
import CustomerLayout from './layouts/CustomerLayout'
import ManagerLayout from './layouts/ManagerLayout'

import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import Forum from './pages/Forum'
import Profile from './pages/Profile'
import ManagerDashboard from './pages/ManagerDashboard'
import OrderTracking from './pages/OrderTracking'
import CategoryPage from './pages/CategoryPage'
import Handbook from './pages/Handbook'
import HandbookDetail from './pages/HandbookDetail'

// Mock components for now
const ManageProducts = () => <div className="container" style={{paddingTop: '2rem'}}><h1>Quản Lý Sản Phẩm</h1></div>

function App() {
  return (
    <Routes>
      {/* Customer Routes */}
      <Route path="/" element={<CustomerLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="category/:parentSlug" element={<CategoryPage />} />
        <Route path="category/:parentSlug/:subSlug" element={<CategoryPage />} />
        <Route path="cart" element={<Cart />} />
        <Route path="orders" element={<OrderTracking />} />
        <Route path="forum" element={<Forum />} />
        <Route path="handbook" element={<Handbook />} />
        <Route path="handbook/:slug" element={<HandbookDetail />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Manager Routes */}
      <Route path="/manager" element={<ManagerLayout />}>
        <Route index element={<ManagerDashboard />} />
        <Route path="products" element={<ManageProducts />} />
      </Route>
    </Routes>
  )
}

export default App
