import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';
import { useForum } from '../../context/ForumContext';
import { useNotification } from '../../context/NotificationContext';

const StaffForumReports = () => {
  const { reports, resolveReport, deletePost, deleteComment, deleteReport } = useForum();
  const { showNotification } = useNotification();

  const handleResolve = (id) => {
    showNotification({
      type: 'confirm',
      message: 'Bạn có chắc chắn muốn bỏ qua báo cáo này?',
      onConfirm: () => {
        resolveReport(id);
        showNotification({ type: 'success', message: 'Đã bỏ qua và xóa báo cáo' });
      }
    });
  };

  const handleDeleteContent = (report) => {
    showNotification({
      type: 'confirm',
      message: 'Bạn có chắc chắn muốn xóa nội dung vi phạm này?',
      onConfirm: () => {
        if (report.type === 'post') {
          deletePost(report.targetId);
        } else if (report.type === 'comment') {
          // Find the post that contains this comment? Wait, our deleteComment needs postId.
          // Let's assume report.targetId is an object { postId, commentId } for comments.
          // I will implement this logic in Forum.jsx when creating reports.
          const { postId, commentId } = report.targetId;
          deleteComment(postId, commentId);
        }
        resolveReport(report.id);
        showNotification({ type: 'success', message: 'Đã xóa nội dung vi phạm' });
      }
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Báo Cáo Vi Phạm (Spam)</h1>
          <p className="text-sm text-gray-500 mt-0.5">Xử lý các bài viết bị người dùng cộng đồng báo cáo vi phạm tiêu chuẩn</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl border border-gray-150 dark:border-gray-700/50 space-y-5 shadow-sm max-w-4xl">
        {reports.length === 0 ? (
          <div className="text-center py-12">
            <ShieldAlert size={48} className="mx-auto text-green-500 mb-3" />
            <p className="text-sm text-gray-500 font-medium">Tuyệt vời! Hiện không có báo cáo vi phạm nào cần xử lý.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((rep) => (
              <div key={rep.id} className="p-5 bg-gray-55/40 dark:bg-gray-900/30 rounded-lg text-sm border border-gray-100 dark:border-gray-750 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors hover:border-gray-200 dark:hover:border-gray-600">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold block text-red-500 text-base">{rep.reason}</span>
                    <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      {rep.type === 'post' ? 'Bài viết' : 'Bình luận'}
                    </span>
                  </div>
                  <span className="text-gray-500 block text-xs">Người gửi báo cáo: <span className="font-medium text-gray-700 dark:text-gray-300">{rep.reporter}</span></span>
                  <p className="text-gray-600 dark:text-gray-400 italic mt-2">"{rep.contentSnippet}"</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button 
                    onClick={() => handleResolve(rep.id)}
                    className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold px-4 py-2 rounded-lg text-xs transition-colors"
                  >
                    Bỏ qua
                  </button>
                  <button 
                    onClick={() => handleDeleteContent(rep)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-lg text-xs shadow-md transition-colors"
                  >
                    Xóa nội dung
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

export default StaffForumReports;
