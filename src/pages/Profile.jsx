import { useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { User, Mail, Phone, MapPin, Save, Camera } from 'lucide-react'
import toast from 'react-hot-toast'
import './Profile.css'

const Profile = () => {
  const { user, updateProfile } = useAuth()
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    avatar: user?.avatar || ''
  })
  
  const fileInputRef = useRef(null)

  if (!user) {
    return <div className="container mx-auto px-4 mt-8 mb-8 text-center py-20 bg-white rounded-xl shadow-sm">Vui lòng đăng nhập để xem trang này.</div>
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error('Kích thước ảnh quá lớn. Vui lòng chọn ảnh dưới 2MB.')
        return
      }
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    try {
      updateProfile(formData)
      toast.success('Đã cập nhật hồ sơ thành công!')
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật!')
      console.error(error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 flex justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 sm:p-8 w-full max-w-2xl border border-gray-100 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-primary border-b border-gray-100 dark:border-gray-700 pb-4">Hồ Sơ Của Tôi</h2>
        
        <div className="flex gap-6 items-center mb-8 pb-6 border-b border-gray-100 dark:border-gray-700">
          <div 
            className="relative group cursor-pointer shrink-0" 
            onClick={() => fileInputRef.current?.click()}
            title="Nhấp để thay đổi ảnh đại diện"
          >
            <div className="w-24 h-24 bg-primary text-white flex justify-center items-center overflow-hidden rounded-full text-4xl font-bold shadow-md border-4 border-white dark:border-gray-800">
              {formData.avatar ? (
                <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                formData.name?.charAt(0).toUpperCase() || 'U'
              )}
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="text-white" size={28} />
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/png, image/jpeg, image/jpg" 
              className="hidden" 
            />
          </div>
          <div>
            <h3 className="font-bold text-xl md:text-2xl text-gray-900 dark:text-white">{formData.name}</h3>
            <p className="text-gray-500 mt-1">{user.role === 'Manager' ? 'Quản Lý Cửa Hàng' : 'Khách Hàng Thành Viên'}</p>
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-sm text-primary hover:underline mt-2 inline-block font-medium"
            >
              Thay đổi ảnh đại diện
            </button>
          </div>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium sm:w-40 shrink-0">
              <User size={18} className="text-gray-400" /> Họ và tên
            </label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              className="flex-1 w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg py-2.5 px-4 outline-none focus:ring-2 focus:ring-primary border border-gray-200 dark:border-gray-600 transition-all" 
              required
            />
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium sm:w-40 shrink-0">
              <Mail size={18} className="text-gray-400" /> Email
            </label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              className="flex-1 w-full bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-lg py-2.5 px-4 outline-none border border-gray-200 dark:border-gray-600 cursor-not-allowed" 
              readOnly
              title="Không thể thay đổi email"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium sm:w-40 shrink-0">
              <Phone size={18} className="text-gray-400" /> Số điện thoại
            </label>
            <input 
              type="tel" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              className="flex-1 w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg py-2.5 px-4 outline-none focus:ring-2 focus:ring-primary border border-gray-200 dark:border-gray-600 transition-all" 
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium sm:w-40 shrink-0 mt-2.5">
              <MapPin size={18} className="text-gray-400" /> Địa chỉ
            </label>
            <textarea 
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
              className="flex-1 w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg py-2.5 px-4 outline-none focus:ring-2 focus:ring-primary border border-gray-200 dark:border-gray-600 transition-all resize-none" 
              rows={3}
            />
          </div>

          <div className="flex justify-end mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
            <button type="submit" className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-sm">
              <Save size={20} /> Lưu hồ sơ
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Profile
