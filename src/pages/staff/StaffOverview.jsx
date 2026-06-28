import { MessageSquare, CheckCircle } from 'lucide-react';
import { useForum } from '../../context/ForumContext';
import { motion } from 'framer-motion';

const StaffOverview = () => {
  const { pendingPosts, posts } = useForum();

  // Stats calculation
  const totalPostsCount = posts.length + pendingPosts.length;
  const pendingPostsCount = pendingPosts.length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Tổng Quan Diễn Đàn</h1>
          <p className="text-base text-gray-500 mt-1">Báo cáo tình hình hoạt động và phê duyệt diễn đàn</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-6 flex items-center gap-5 transition-transform hover:-translate-y-1">
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <MessageSquare size={26} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Tổng Bài Viết</p>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{totalPostsCount}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-6 flex items-center gap-5 transition-transform hover:-translate-y-1">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <CheckCircle size={26} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Bài Chờ Duyệt</p>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{pendingPostsCount}</h3>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StaffOverview;
