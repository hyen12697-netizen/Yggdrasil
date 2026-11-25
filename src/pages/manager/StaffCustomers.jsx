import React, { useEffect, useState } from 'react';
import { getCustomers, toggleCustomerStatus, formatCustomerStatus } from '../../api/customers';

export default function StaffCustomers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchCustomersList = async () => {
        try {
            setLoading(true);
            const res = await getCustomers({ page, size: 10, search });

            // Xử lý linh hoạt: Nếu axiosClient đã unwrap data thì lấy trực tiếp res, ngược lại lấy res.data
            const resData = res?.data || res;
            const customerList = resData?.content || (Array.isArray(resData) ? resData : []);

            setCustomers(customerList);
            setTotalPages(resData?.totalPages || 1);
        } catch (error) {
            console.error("Lỗi khi tải danh sách khách hàng:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomersList();
    }, [page, search]);

    const handleToggleStatus = async (id) => {
        try {
            await toggleCustomerStatus(id);
            // Gọi lại API để cập nhật danh sách mới nhất
            fetchCustomersList();
        } catch (error) {
            alert("Thất bại khi đổi trạng thái tài khoản!");
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý Khách hàng</h1>
            </div>

            {/* Bộ lọc tìm kiếm */}
            <div className="bg-white p-4 rounded-lg shadow mb-6 flex gap-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên, email, SĐT..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(0); // Reset về trang đầu khi tìm kiếm
                    }}
                    className="border border-gray-300 p-2 rounded-lg w-1/3 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
            </div>

            {/* Bảng hiển thị danh sách */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b text-gray-600 text-left">
                            <th className="p-4">ID</th>
                            <th className="p-4">Họ tên</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Số điện thoại</th>
                            <th className="p-4 text-center">Trạng thái</th>
                            <th className="p-4 text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" className="text-center p-6 text-gray-500">Đang tải dữ liệu...</td></tr>
                        ) : customers.length === 0 ? (
                            <tr><td colSpan="6" className="text-center p-6 text-gray-500">Không tìm thấy khách hàng nào.</td></tr>
                        ) : (
                            customers.map((cus) => (
                                <tr key={cus.id} className="border-b hover:bg-gray-50 transition">
                                    <td className="p-4 text-gray-600">#{cus.id}</td>
                                    <td className="p-4 font-medium text-gray-800">{cus.fullName}</td>
                                    <td className="p-4 text-gray-600">{cus.email}</td>
                                    <td className="p-4 text-gray-600">{cus.phone || 'Chưa cập nhật'}</td>
                                    <td className="p-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cus.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {formatCustomerStatus(cus.status)}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => handleToggleStatus(cus.id)}
                                            className={`px-3 py-1.5 rounded-lg text-white text-xs font-medium shadow-sm transition ${cus.status === 'ACTIVE'
                                                ? 'bg-red-500 hover:bg-red-600'
                                                : 'bg-green-600 hover:bg-green-700'
                                                }`}
                                        >
                                            {cus.status === 'ACTIVE' ? 'Khóa tài khoản' : 'Mở khóa'}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}