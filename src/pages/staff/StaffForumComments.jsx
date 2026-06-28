import { motion } from 'framer-motion';
import { MessageCircle, Trash2, Eye, EyeOff } from 'lucide-react';
import { useForum } from '../../context/ForumContext';
import { useNotification } from '../../context/NotificationContext';

const StaffForumComments = () => {
  const { posts, deleteComment, toggleCommentVisibility } = useForum();
  const { showNotification } = useNotification();

  // Extract all comments from all posts
  const allComments = posts.flatMap(post => 
    post.comments.map(comment => ({
      ...comment,
      postId: post.id,
      postTitle: post.title || post.content.substring(0, 50) + '...'
    }))
  ).sort((a, b) => b.id - a.id); // Sort by newest

  const handleDelete = (postId, commentId) => {
    showNotification({
      type: 'confirm',
      message: 'Bạn có chắc chắn muốn xóa bình luận này vĩnh viễn?',
      onConfirm: () => {
        deleteComment(postId, commentId);
        showNotification({ type: 'success', message: 'Đã xóa bình luận' });
      }
    });
  };

  const handleToggleVisibility = (postId, commentId, isHidden) => {
    showNotification({
      type: 'confirm',
      message: isHidden ? 'Hiển thị lại bình luận này cho mọi người?' : 'Ẩn bình luận này khỏi diễn đàn?',
      onConfirm: () => {
        toggleCommentVisibility(postId, commentId);
        showNotification({ type: 'success', message: isHidden ? 'Đã hiển thị lại bình luận' : 'Đã ẩn bình luận' });
      }
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Quản Lý Bình Luận</h1>
          <p className="text-sm text-gray-500 mt-0.5">Theo dõi và kiểm duyệt các luồng thảo luận bên dưới bài viết</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl border border-gray-150 dark:border-gray-700/50 space-y-5 shadow-sm max-w-4xl">
        {allComments.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-sm text-gray-500 font-medium">Chưa có bình luận nào trên hệ thống.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {allComments.map((comment) => (
              <div key={`${comment.postId}-${comment.id}`} className={`p-5 rounded-lg text-sm border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${comment.isHidden ? 'bg-gray-100 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 opacity-60' : 'bg-gray-50/50 dark:bg-gray-900/30 border-gray-150 dark:border-gray-750 hover:border-gray-200 dark:hover:border-gray-600'}`}>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 dark:text-gray-100">{comment.author}</span>
                    {comment.isHidden && <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Đã Ẩn</span>}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">"{comment.content}"</p>
                  <p className="text-xs text-gray-400 font-medium">Trong bài: <span className="italic">"{comment.postTitle}"</span></p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button 
                    onClick={() => handleToggleVisibility(comment.postId, comment.id, comment.isHidden)}
                    className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold p-2 rounded-lg transition-colors"
                    title={comment.isHidden ? "Hiển thị lại" : "Ẩn bình luận này"}
                  >
                    {comment.isHidden ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  <button 
                    onClick={() => handleDelete(comment.postId, comment.id)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-955/20 dark:text-red-400 font-bold p-2 rounded-lg transition-colors border border-red-200 dark:border-red-800"
                    title="Xóa vĩnh viễn"
                  >
                    <Trash2 size={18} />
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

export default StaffForumComments;
