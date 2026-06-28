import { Routes, Route } from 'react-router-dom'
import CustomerLayout from './layouts/CustomerLayout'
import ManagerLayout from './layouts/ManagerLayout'
import StaffLayout from './layouts/StaffLayout'

import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import Forum from './pages/Forum'
import Profile from './pages/Profile'
import ManagerDashboard from './pages/ManagerDashboard'
import CustomerDetail from './pages/manager/CustomerDetail'
import EmployeeDetail from './pages/manager/EmployeeDetail'
import Wishlist from './pages/Wishlist'

import StaffOverview from './pages/staff/StaffOverview'
import StaffForumPosts from './pages/staff/StaffForumPosts'
import StaffForumComments from './pages/staff/StaffForumComments'
import StaffForumReports from './pages/staff/StaffForumReports'
import StaffProfile from './pages/staff/StaffProfile'
import StaffOrders from './pages/staff/StaffOrders'
import StaffCustomers from './pages/staff/StaffCustomers'
import StaffHandbook from './pages/staff/StaffHandbook'
import StaffNews from './pages/staff/StaffNews'
import StaffNotifications from './pages/staff/StaffNotifications'
import OrderTracking from './pages/OrderTracking'
import CategoryPage from './pages/CategoryPage'
import Handbook from './pages/Handbook'
import HandbookDetail from './pages/HandbookDetail'
import NewsDetail from './pages/NewsDetail'

import ScrollToTop from './components/ScrollToTop'

// Mock components for now
const ManageProducts = () => <div className="container" style={{paddingTop: '2rem'}}><h1>Quản Lý Sản Phẩm</h1></div>

function App() {
  return (
    <>
      <ScrollToTop />
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
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="orders" element={<OrderTracking />} />
        <Route path="forum" element={<Forum />} />
        <Route path="handbook" element={<Handbook />} />
        <Route path="handbook/:slug" element={<HandbookDetail />} />
        <Route path="news/:id" element={<NewsDetail />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Manager Routes */}
      <Route path="/manager" element={<ManagerLayout />}>
        <Route index element={<ManagerDashboard />} />
        <Route path="employees/:id" element={<EmployeeDetail />} />
        <Route path="products" element={<ManageProducts />} />
      </Route>

      {/* Staff Routes */}
      <Route path="/staff" element={<StaffLayout />}>
        <Route index element={<StaffOverview />} />
        <Route path="forum/posts" element={<StaffForumPosts />} />
        <Route path="forum/comments" element={<StaffForumComments />} />
        <Route path="forum/reports" element={<StaffForumReports />} />
        <Route path="orders" element={<StaffOrders />} />
        <Route path="customers" element={<StaffCustomers />} />
        <Route path="customers/:id" element={<CustomerDetail />} />
        <Route path="handbook" element={<StaffHandbook />} />
        <Route path="news" element={<StaffNews />} />
        <Route path="notifications" element={<StaffNotifications />} />
        <Route path="settings/profile" element={<StaffProfile />} />
      </Route>
    </Routes>
    </>
  )
}

export default App
