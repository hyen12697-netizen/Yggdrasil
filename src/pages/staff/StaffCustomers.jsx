import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Loader2, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { getCustomers, formatCustomerStatus } from '../../api/customers';
import { useNotification } from '../../context/NotificationContext';

const PAGE_SIZE = 10;

const StaffCustomers = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  // ── State ──────────────────────────────────────────────────────────────────
  const [customerSearch, setCustomerSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(0); // 0-indexed
  const [data, setData] = useState({ content: [], totalElements: 0, totalPages: 0, page: 0 });
  const [loading, setLoading] = useState(true);

  // ── Debounce search (400 ms) ───────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(customerSearch.trim());
      setCurrentPage(0); // reset về trang đầu khi search thay đổi
    }, 400);
    return () => clearTimeout(timer);
  }, [customerSearch]);

  // ── Fetch data ─────────────────────────────────────────────────────────────
  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getCustomers({
        page: currentPage,
        size: PAGE_SIZE,
        search: debouncedSearch || undefined,
      });
      setData(result);
    } catch (err) {
      showNotification({ type: 'error', message: err.message || 'Không thể tải danh sách khách hàng.' });
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // ── Skeleton rows ──────────────────────────────────────────────────────────
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <td key={i} className="px-5 py-4.5">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        </td>
      ))}
    </tr>
  );

  const customers = data.content ?? [];
  const totalPages = data.totalPages ?? 0;
  const totalElements = data.totalElements ?? 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Danh Sách Khách Hàng</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Quản lý và tra cứu thông tin khách hàng trên hệ thống
            {!loading && (
              <span className="ml-2 text-primary font-semibold">({totalElements.toLocaleString('vi-VN')} khách hàng)</span>
            )}
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Tìm tên, email, SĐT..."
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white"
            value={customerSearch}
            onChange={(e) => setCustomerSearch(e.target.value)}
          />
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* ── Table ──────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-655 dark:text-gray-450">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 font-bold">
              <tr>
                <th className="px-5 py-4 whitespace-nowrap">Mã KH</th>
                <th className="px-5 py-4 min-w-[150px]">Họ và Tên</th>
                <th className="px-5 py-4 whitespace-nowrap">Liên hệ</th>
                <th className="px-5 py-4 text-center whitespace-nowrap">Trạng thái</th>
                <th className="px-5 py-4 text-center whitespace-nowrap">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-750">
              {loading ? (
                Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonRow key={i} />)
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-5 py-16 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-3">
                      <Users size={40} className="opacity-30" />
                      <p className="font-medium">
                        {debouncedSearch
                          ? `Không tìm thấy khách hàng khớp với "${debouncedSearch}"`
                          : 'Chưa có khách hàng nào trên hệ thống'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                customers.map((c) => {
                  const statusLabel = formatCustomerStatus(c.status);
                  const isActive = c.status === 'ACTIVE';
                  return (
                    <tr key={c.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-750/30 transition-colors">
                      <td className="px-5 py-4.5 font-bold text-gray-900 dark:text-white whitespace-nowrap">
                        #{c.id}
                      </td>
                      <td className="px-5 py-4.5 font-extrabold text-gray-900 dark:text-white text-base">
                        {c.fullName}
                      </td>
                      <td className="px-5 py-4.5 text-gray-500 font-medium">
                        <div className="text-xs text-gray-800 dark:text-gray-300">{c.email}</div>
                        <div className="text-xs">{c.phone || '—'}</div>
                      </td>
                      <td className="px-5 py-4.5 text-center whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isActive
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}
                        >
                          {statusLabel}
                        </span>
                      </td>
                      <td className="px-5 py-4.5 text-center whitespace-nowrap">
                        <button
                          onClick={() => navigate('/staff/customers/' + c.id)}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg transition-colors font-bold text-xs"
                        >
                          Xem chi tiết
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ───────────────────────────────────────────────────── */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 dark:border-gray-700/50">
            <p className="text-sm text-gray-500">
              Trang <span className="font-bold text-gray-800 dark:text-gray-200">{currentPage + 1}</span> /{' '}
              <span className="font-bold text-gray-800 dark:text-gray-200">{totalPages}</span>
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
              </button>

              {/* Page numbers */}
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let page;
                if (totalPages <= 5) {
                  page = i;
                } else if (currentPage < 3) {
                  page = i;
                } else if (currentPage > totalPages - 4) {
                  page = totalPages - 5 + i;
                } else {
                  page = currentPage - 2 + i;
                }
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-sm font-bold transition-colors ${
                      page === currentPage
                        ? 'bg-primary text-white'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {page + 1}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage >= totalPages - 1}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StaffCustomers;
