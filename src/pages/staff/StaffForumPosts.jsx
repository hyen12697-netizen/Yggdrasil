import { CheckCircle } from 'lucide-react';
import { useForum } from '../../context/ForumContext';
import { useNotification } from '../../context/NotificationContext';
import { motion } from 'framer-motion';

const StaffForumPosts = () => {
  const { pendingPosts, approvePost, rejectPost } = useForum();
  const { showNotification } = useNotification();

  const handleApprove = (id) => {
    showNotification({
      type: 'confirm',
      message: 'Bạn có chắc chắn muốn duyệt bài viết này?',
      onConfirm: () => {
        approvePost(id);
        showNotification({ type: 'success', message: 'Đã duyệt bài viết' });
      }
    });
  };

  const handleReject = (id) => {
    showNotification({
      type: 'confirm',
      message: 'Bạn có chắc chắn muốn từ chối bài viết này?',
      onConfirm: () => {
        rejectPost(id);
        showNotification({ type: 'success', message: 'Đã từ chối bài viết' });
      }
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Duyệt Bài Viết</h1>
          <p className="text-sm text-gray-500 mt-0.5">Kiểm duyệt các bài viết nông nghiệp được tải lên hệ thống từ cộng đồng</p>
        </div>
        {pendingPosts.length > 0 && (
          <span className="bg-yellow-100 text-yellow-800 text-sm font-bold px-4 py-1.5 rounded-full animate-pulse">
            {pendingPosts.length} bài đăng cần duyệt
          </span>
        )}
      </div>

      <div className="space-y-5">
        {pendingPosts.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-12 border border-gray-150 dark:border-gray-750 text-center">
            <CheckCircle size={48} className="mx-auto text-green-500 mb-3" />
            <p className="text-sm text-gray-500 font-medium">Hàng đợi trống! Tất cả các thảo luận đã xuất bản an toàn.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pendingPosts.map(post => (
              <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-150 dark:border-gray-750 flex flex-col justify-between space-y-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-650 text-white flex items-center justify-center font-bold text-sm">{post.author.charAt(0)}</div>
                  <div>
                    <span className="font-bold text-gray-950 dark:text-white block text-sm">{post.author}</span>
                    <span className="text-xs text-gray-400 mt-0.5">{post.time}</span>
                  </div>
                </div>
                {post.title && <h4 className="font-bold text-base text-gray-950 dark:text-white">{post.title}</h4>}
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">{post.content}</p>
                <div className="flex gap-3 justify-end pt-4 border-t border-gray-100 dark:border-gray-700/50">
                  <button onClick={() => handleReject(post.id)} className="bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-955/20 dark:text-red-400 font-bold px-4 py-2 rounded-lg text-xs border border-red-200 dark:border-red-800 transition-colors">
                    Từ chối
                  </button>
                  <button onClick={() => handleApprove(post.id)} className="bg-primary hover:bg-primary-dark text-white font-bold px-5 py-2 rounded-lg text-xs shadow-md transition-colors">
                    Duyệt xuất bản
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StaffForumPosts;
