import { useState, useRef } from 'react';
import { ThumbsUp, MessageCircle, Share2, MoreHorizontal, Send, Image as ImageIcon, Tag, X, Search, Edit, Trash2, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useForum } from '../context/ForumContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Helper to remove Vietnamese accents for better search
const removeAccents = (str) => {
  return str.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D');
};

const Forum = () => {
  const { user } = useAuth();
  const { posts, pendingPosts, addPendingPost, addComment, toggleLike, editPost, deletePost } = useForum();
  
  const [viewMode, setViewMode] = useState('all'); // 'all' or 'my_posts'
  const [showPostModal, setShowPostModal] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState('');
  
  const [commentInput, setCommentInput] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);

  // Edit states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editImage, setEditImage] = useState('');

  // Delete states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState(null);

  // Detail states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailedPost, setDetailedPost] = useState(null);

  const handlePostSubmit = () => {
    if (!newPostContent.trim()) {
      toast.error('Vui lòng nhập nội dung bài viết!');
      return;
    }
    
    addPendingPost({
      authorId: user?.id,
      author: user?.name || 'Khách Hàng',
      avatar: user?.avatar || 'https://i.pravatar.cc/150?u=customer',
      time: 'Vừa xong',
      title: newPostTitle,
      content: newPostContent,
      image: newPostImage || undefined
    });
    
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostImage('');
    setShowPostModal(false);
    toast.success('Bài viết đang chờ kiểm duyệt!');
  };

  const handleEditSubmit = () => {
    if (!editContent.trim()) {
      toast.error('Nội dung bài viết không được để trống!');
      return;
    }
    
    editPost(editingPost.id, {
      title: editTitle,
      content: editContent,
      image: editImage || null
    });
    
    setShowEditModal(false);
    setEditingPost(null);
    toast.success('Đã cập nhật bài viết thành công!');
  };

  const handleDeleteConfirm = () => {
    deletePost(deletingPostId);
    setShowDeleteConfirm(false);
    setDeletingPostId(null);
    toast.success('Đã xóa bài viết thành công!');
  };

  const handleCommentSubmit = (postId) => {
    const text = commentInput[postId];
    if (!user) {
      toast.error('Vui lòng đăng nhập để bình luận!');
      return;
    }
    if (!text?.trim()) return;
    
    addComment(postId, {
      author: user.name,
      avatar: user.avatar || 'https://i.pravatar.cc/150?u=customer',
      content: text
    });
    
    setCommentInput({ ...commentInput, [postId]: '' });
    setExpandedComments({ ...expandedComments, [postId]: true });
  };

  const handleLike = (postId) => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để thích bài viết!');
      return;
    }
    toggleLike(postId, user.id);
  };

  const handleShare = (post) => {
    const shareLink = `${window.location.origin}/forum#post-${post.id}`;
    navigator.clipboard.writeText(shareLink).then(() => {
      toast.success('Đã sao chép liên kết chia sẻ vào bộ nhớ tạm!');
    }).catch(() => {
      toast.error('Không thể sao chép liên kết. Vui lòng thử lại!');
    });
  };

  const toggleCommentSection = (postId) => {
    setExpandedComments({
      ...expandedComments,
      [postId]: !expandedComments[postId]
    });
  };

  // Base list of posts based on viewMode
  const userPosts = [
    ...posts.filter(post => post.authorId === user?.id || post.author === user?.name),
    ...pendingPosts.filter(post => post.authorId === user?.id || post.author === user?.name).map(p => ({ ...p, isPending: true }))
  ];

  const basePosts = viewMode === 'my_posts' ? userPosts : posts;

  // Sort: newest first
  const sortedPosts = [...basePosts].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  // Filter posts based on real-time search query
  const filteredPosts = sortedPosts.filter(post => {
    if (!searchQuery.trim()) return true;
    const query = removeAccents(searchQuery.toLowerCase());
    
    if (viewMode === 'my_posts') {
      const titleMatch = post.title ? removeAccents(post.title.toLowerCase()).includes(query) : false;
      const contentMatch = removeAccents(post.content.toLowerCase()).includes(query);
      return titleMatch || contentMatch;
    } else {
      const authorMatch = removeAccents(post.author.toLowerCase()).includes(query);
      const contentMatch = removeAccents(post.content.toLowerCase()).includes(query);
      return authorMatch || contentMatch;
    }
  });

  const handleFocusSearch = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Find currently detailed post reactively from state to keep comments updated
  const currentDetailedPost = detailedPost 
    ? (posts.find(p => p.id === detailedPost.id) || pendingPosts.find(p => p.id === detailedPost.id) || detailedPost)
    : null;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar */}
        <div className="w-full lg:w-64 shrink-0 hidden md:block">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sticky top-24">
            <ul className="space-y-2 font-medium text-gray-700 dark:text-gray-300">
              <li>
                <button 
                  onClick={() => setViewMode('all')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                    viewMode === 'all' 
                      ? 'bg-primary/10 text-primary font-bold' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  Tất cả bài viết
                </button>
              </li>
              <li>
                <button 
                  onClick={handleFocusSearch} 
                  className="w-full text-left px-4 py-3 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors"
                >
                  <Search size={18} /> Tìm kiếm
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    if (user) {
                      setViewMode('my_posts');
                    } else {
                      toast.error('Vui lòng đăng nhập để xem bài viết của bạn!');
                    }
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                    viewMode === 'my_posts' 
                      ? 'bg-primary/10 text-primary font-bold' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  Bài viết của tôi
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Feed */}
        <div className="flex-1 max-w-2xl mx-auto w-full">
          {/* Search Bar */}
          <div className="relative mb-6">
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder={
                viewMode === 'my_posts' 
                  ? 'Tìm kiếm bài viết của tôi theo tiêu đề, nội dung...' 
                  : 'Tìm kiếm bài viết theo người đăng, nội dung...'
              }
              className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl py-3 pl-12 pr-12 outline-none focus:ring-2 focus:ring-primary border border-gray-100 dark:border-gray-700 shadow-sm transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors bg-gray-100 dark:bg-gray-700 rounded-full p-1"
                title="Xóa tìm kiếm"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Create Post Widget */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6 mb-6">
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden shrink-0">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary text-white font-bold text-xl">
                    {user ? user.name.charAt(0) : 'U'}
                  </div>
                )}
              </div>
              <button 
                onClick={() => {
                  if (user) setShowPostModal(true);
                  else toast.error("Vui lòng đăng nhập để đăng bài!");
                }}
                className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-left text-gray-500 dark:text-gray-400 py-3 px-6 rounded-full transition-colors outline-none"
              >
                {user ? `${user.name.split(' ').pop()} ơi, bạn đang nghĩ gì về cây trồng?` : "Vui lòng đăng nhập để đăng bài"}
              </button>
            </div>
            <div className="flex justify-around mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button 
                onClick={() => {
                  if (user) setShowPostModal(true);
                  else toast.error("Vui lòng đăng nhập để đăng bài!");
                }}
                className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors py-2 px-4 rounded-lg hover:bg-primary/5 font-medium"
              >
                <ImageIcon size={20} className="text-green-500" /> 
                <span className="hidden sm:inline">Ảnh/Video</span>
              </button>
              <button className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors py-2 px-4 rounded-lg hover:bg-primary/5 font-medium">
                <Tag size={20} className="text-blue-500" /> 
                <span className="hidden sm:inline">Gắn thẻ</span>
              </button>
            </div>
          </div>

          {/* Posts List */}
          <div className="space-y-6">
            {viewMode === 'my_posts' && userPosts.length === 0 ? (
              /* Custom Empty State */
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-10 text-center flex flex-col items-center">
                <div className="bg-primary/10 text-primary p-4 rounded-full mb-4">
                  <MessageCircle size={40} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Bạn chưa có bài viết nào
                </h3>
                <p className="text-gray-500 max-w-sm mx-auto mb-6">
                  Bạn chưa có bài viết nào. Hãy chia sẻ bài viết đầu tiên của mình!
                </p>
                <button 
                  onClick={() => setShowPostModal(true)} 
                  className="bg-primary hover:bg-primary-dark text-white font-medium py-2.5 px-6 rounded-xl transition-colors shadow-sm"
                >
                  Đăng bài viết mới
                </button>
              </div>
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map(post => {
                const hasLiked = user && post.likedBy?.includes(user.id);
                const isOwner = user && (post.authorId === user.id || post.author === user.name);

                return (
                  <div key={post.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6">
                    
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 shrink-0">
                          {post.avatar.length > 1 ? (
                             <img src={post.avatar} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                             <div className="w-full h-full flex items-center justify-center bg-green-600 text-white font-bold">{post.avatar}</div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white leading-tight">{post.author}</h4>
                          <span className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                            {post.time}
                            {post.isPending && (
                              <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                Đang chờ duyệt
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                      
                      {/* More Option / Dropdown */}
                      <div className="relative">
                        <button 
                          onClick={() => {
                            if (isOwner) {
                              setEditingPost(post);
                              setEditTitle(post.title || '');
                              setEditContent(post.content || '');
                              setEditImage(post.image || '');
                              setShowEditModal(true);
                            } else {
                              setDetailedPost(post);
                              setShowDetailModal(true);
                            }
                          }}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          title={isOwner ? "Chỉnh sửa bài viết" : "Xem chi tiết"}
                        >
                          <MoreHorizontal size={20} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="mb-4">
                      {post.title && (
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-snug">
                          {post.title}
                        </h3>
                      )}
                      <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line leading-relaxed">
                        {post.content}
                      </p>
                      {post.image && (
                        <div className="mt-4 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900 max-h-96">
                          <img src={post.image} alt="Post media" className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal" />
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex justify-between text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
                      <span className="flex items-center gap-1">
                        <ThumbsUp size={14} className={hasLiked ? "text-primary fill-primary" : "text-primary fill-primary/20"} /> {post.likes}
                      </span>
                      <span onClick={() => toggleCommentSection(post.id)} className="hover:underline cursor-pointer">
                        {post.comments?.length || 0} bình luận
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-4 mb-4">
                      <button onClick={() => handleLike(post.id)} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition-colors ${hasLiked ? 'text-primary bg-primary/5' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                        <ThumbsUp size={20} className={hasLiked ? "fill-primary" : ""} /> <span className="hidden sm:inline">Thích</span>
                      </button>
                      <button onClick={() => toggleCommentSection(post.id)} className="flex-1 flex items-center justify-center gap-2 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 py-2 rounded-lg font-medium transition-colors">
                        <MessageCircle size={20} /> <span className="hidden sm:inline">Bình luận</span>
                      </button>
                      <button onClick={() => handleShare(post)} className="flex-1 flex items-center justify-center gap-2 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 py-2 rounded-lg font-medium transition-colors">
                        <Share2 size={20} /> <span className="hidden sm:inline">Chia sẻ</span>
                      </button>
                    </div>

                    {/* Management Action Buttons for Owner */}
                    {isOwner && (
                      <div className="flex justify-end gap-2 pb-4 mb-4 border-b border-gray-100 dark:border-gray-700">
                        <button 
                          onClick={() => {
                            setDetailedPost(post);
                            setShowDetailModal(true);
                          }}
                          className="text-xs font-semibold flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-gray-700 hover:text-primary bg-gray-100 hover:bg-primary/10 dark:text-gray-300 dark:bg-gray-750 dark:hover:bg-primary/20 transition-all border border-gray-200 dark:border-gray-700"
                        >
                          <Eye size={14} /> Xem chi tiết
                        </button>
                        <button 
                          onClick={() => {
                            setEditingPost(post);
                            setEditTitle(post.title || '');
                            setEditContent(post.content || '');
                            setEditImage(post.image || '');
                            setShowEditModal(true);
                          }}
                          className="text-xs font-semibold flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 transition-all border border-blue-150 dark:border-blue-800"
                        >
                          <Edit size={14} /> Chỉnh sửa
                        </button>
                        <button 
                          onClick={() => {
                            setDeletingPostId(post.id);
                            setShowDeleteConfirm(true);
                          }}
                          className="text-xs font-semibold flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-900/20 dark:hover:bg-red-900/40 transition-all border border-red-150 dark:border-red-800"
                        >
                          <Trash2 size={14} /> Xóa
                        </button>
                      </div>
                    )}

                    {/* Comments */}
                    <AnimatePresence>
                      {expandedComments[post.id] && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="space-y-4 overflow-hidden"
                        >
                          {post.comments?.map(cmt => (
                            <div key={cmt.id} className="flex gap-3">
                              <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 mt-1">
                                {cmt.avatar ? (
                                  <img src={cmt.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">{cmt.author.charAt(0)}</div>
                                )}
                              </div>
                              <div className="bg-gray-100 dark:bg-gray-700/50 rounded-2xl px-4 py-2.5 max-w-[85%]">
                                <strong className="block text-sm font-semibold text-gray-900 dark:text-white mb-0.5">{cmt.author}</strong>
                                <span className="text-gray-800 dark:text-gray-200 text-sm">{cmt.content}</span>
                              </div>
                            </div>
                          ))}
                          
                          {/* Add Comment */}
                          <div className="flex gap-3 items-center mt-4">
                            <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-gray-200">
                              {user?.avatar ? (
                                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-400 text-white text-xs font-bold">{user ? user.name.charAt(0) : 'U'}</div>
                              )}
                            </div>
                            <div className="flex-1 relative">
                              <input 
                                type="text" 
                                placeholder="Viết bình luận..."
                                className="w-full bg-gray-100 dark:bg-gray-700 border-transparent rounded-full px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-primary"
                                value={commentInput[post.id] || ''}
                                onChange={(e) => setCommentInput({...commentInput, [post.id]: e.target.value})}
                                onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit(post.id)}
                              />
                              <button 
                                onClick={() => handleCommentSubmit(post.id)}
                                className="absolute right-2 top-1.5 bottom-1.5 w-8 h-8 bg-primary hover:bg-primary-dark text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
                              >
                                <Send size={14} className="-ml-0.5" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            ) : (
              /* Search Empty State */
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-10 text-center flex flex-col items-center">
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full mb-4">
                  <Search size={40} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Không tìm thấy bài viết phù hợp</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">Chúng tôi không thể tìm thấy nội dung liên quan đến "{searchQuery}". Vui lòng thử lại với từ khóa khác hoặc kiểm tra lại lỗi chính tả.</p>
                <button 
                  onClick={() => setSearchQuery('')} 
                  className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-6 rounded-lg transition-colors shadow-sm"
                >
                  Xóa tìm kiếm
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-80 shrink-0 hidden lg:block">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sticky top-24">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Chuyên gia Yggdrasil</h3>
            <p className="text-sm text-gray-500 mb-6">Kết nối với đội ngũ kỹ sư nông nghiệp để được tư vấn các vấn đề về cây trồng hoàn toàn miễn phí.</p>
            <a href="https://zalo.me/08357757501" target="_blank" rel="noreferrer" className="w-full border-2 border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
              Liên hệ Zalo
            </a>
          </div>
        </div>
      </div>

      {/* Post Modal */}
      <AnimatePresence>
        {showPostModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center relative">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white w-full text-center">Tạo bài viết</h3>
                <button onClick={() => setShowPostModal(false)} className="absolute right-4 p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full transition-colors">
                  <X size={20} className="text-gray-600 dark:text-gray-300" />
                </button>
              </div>
              
              <div className="p-4 overflow-y-auto max-h-[70vh] space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                     {user?.avatar ? (
                        <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary text-white font-bold">{user?.name.charAt(0)}</div>
                      )}
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 dark:text-white block">{user?.name}</span>
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded font-medium text-gray-600 dark:text-gray-300">Thành viên</span>
                  </div>
                </div>

                {/* Optional Title input */}
                <div>
                  <input 
                    type="text" 
                    placeholder="Tiêu đề bài viết (tùy chọn)"
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm text-gray-950 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                  />
                </div>
                
                <textarea 
                  className="w-full min-h-[120px] p-2 border border-gray-100 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 resize-none text-gray-900 dark:text-white bg-transparent text-base outline-none placeholder:text-gray-400"
                  placeholder={`${user?.name.split(' ').pop()} ơi, bà con đang gặp vấn đề gì? Hãy chia sẻ nhé...`}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  autoFocus
                ></textarea>

                {/* Image Upload/Preview */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
                    Hình ảnh đính kèm
                  </label>
                  {newPostImage ? (
                    <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 max-h-48 bg-gray-50">
                      <img src={newPostImage} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => setNewPostImage('')}
                        className="absolute right-2 top-2 p-1.5 bg-black/70 hover:bg-black/90 text-white rounded-full transition-colors shadow-lg"
                        title="Xóa ảnh"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input 
                        type="file" 
                        accept="image/*" 
                        id="create-post-image-upload" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewPostImage(reader.result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <label 
                        htmlFor="create-post-image-upload" 
                        className="flex-1 flex items-center justify-center gap-2 border border-dashed border-gray-300 dark:border-gray-700 hover:border-primary dark:hover:border-primary rounded-xl py-5 cursor-pointer text-gray-500 hover:text-primary transition-all bg-gray-50 dark:bg-gray-800/40 text-sm font-medium"
                      >
                        <ImageIcon size={20} className="text-green-500" /> Chọn ảnh từ thiết bị
                      </label>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-4 pt-0">
                <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 text-xs p-3 rounded-lg mb-4">
                  <strong>Lưu ý:</strong> Bài viết của bạn sẽ được đội ngũ Yggdrasil kiểm duyệt trước khi hiển thị công khai để đảm bảo môi trường diễn đàn lành mạnh và hữu ích cho mọi người.
                </div>
                <button 
                  onClick={handlePostSubmit}
                  className={`w-full py-3 rounded-xl font-bold transition-all shadow-sm ${
                    newPostContent.trim() 
                      ? 'bg-primary hover:bg-primary-dark text-white shadow-md' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!newPostContent.trim()}
                >
                  Đăng bài
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Post Modal */}
      <AnimatePresence>
        {showEditModal && editingPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center relative">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white w-full text-center">Chỉnh sửa bài viết</h3>
                <button 
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingPost(null);
                  }} 
                  className="absolute right-4 p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-600 dark:text-gray-300" />
                </button>
              </div>
              
              <div className="p-4 overflow-y-auto max-h-[70vh] space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
                    Tiêu đề bài viết
                  </label>
                  <input 
                    type="text" 
                    placeholder="Tiêu đề bài viết (tùy chọn)"
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm text-gray-955 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                </div>
                
                {/* Content */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
                    Nội dung bài viết
                  </label>
                  <textarea 
                    className="w-full min-h-[120px] p-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 resize-none text-gray-900 dark:text-white bg-transparent text-base outline-none placeholder:text-gray-400"
                    placeholder="Viết nội dung bài viết..."
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  ></textarea>
                </div>

                {/* Image Edit/Preview */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
                    Hình ảnh đính kèm
                  </label>
                  {editImage ? (
                    <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 max-h-48 bg-gray-50">
                      <img src={editImage} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => setEditImage('')}
                        className="absolute right-2 top-2 p-1.5 bg-black/70 hover:bg-black/90 text-white rounded-full transition-colors shadow-lg"
                        title="Xóa ảnh"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input 
                        type="file" 
                        accept="image/*" 
                        id="edit-post-image-upload" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setEditImage(reader.result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <label 
                        htmlFor="edit-post-image-upload" 
                        className="flex-1 flex items-center justify-center gap-2 border border-dashed border-gray-300 dark:border-gray-700 hover:border-primary dark:hover:border-primary rounded-xl py-5 cursor-pointer text-gray-500 hover:text-primary transition-all bg-gray-50 dark:bg-gray-800/40 text-sm font-medium"
                      >
                        <ImageIcon size={20} className="text-green-500" /> Chọn ảnh từ thiết bị
                      </label>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-4 pt-0">
                <button 
                  onClick={handleEditSubmit}
                  className={`w-full py-3 rounded-xl font-bold transition-all shadow-sm ${
                    editContent.trim() 
                      ? 'bg-primary hover:bg-primary-dark text-white shadow-md' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!editContent.trim()}
                >
                  Lưu thay đổi
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden p-6 text-center space-y-4"
            >
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto">
                <Trash2 size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Xóa bài viết</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                  Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeletingPostId(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                >
                  Hủy
                </button>
                <button 
                  onClick={handleDeleteConfirm}
                  className="flex-1 py-2.5 rounded-xl font-semibold bg-red-600 hover:bg-red-700 text-white shadow-md transition-colors"
                >
                  Xóa bài viết
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Detail Modal */}
      <AnimatePresence>
        {showDetailModal && currentDetailedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center relative">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white w-full text-center">Chi tiết bài viết</h3>
                <button 
                  onClick={() => {
                    setShowDetailModal(false);
                    setDetailedPost(null);
                  }} 
                  className="absolute right-4 p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-600 dark:text-gray-300" />
                </button>
              </div>
              
              {/* Body */}
              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                {/* Author Info */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 shrink-0">
                    {currentDetailedPost.avatar.length > 1 ? (
                      <img src={currentDetailedPost.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-green-600 text-white font-bold">{currentDetailedPost.avatar}</div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white leading-tight">{currentDetailedPost.author}</h4>
                    <span className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                      {currentDetailedPost.time}
                      {currentDetailedPost.isPending && (
                        <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Đang chờ duyệt
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  {currentDetailedPost.title && (
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-snug">{currentDetailedPost.title}</h2>
                  )}
                  <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line leading-relaxed text-base">
                    {currentDetailedPost.content}
                  </p>
                  {currentDetailedPost.image && (
                    <div className="mt-4 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900 max-h-96">
                      <img src={currentDetailedPost.image} alt="Post media" className="w-full h-full object-contain mx-auto" />
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="flex justify-between text-sm text-gray-500 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <span className="flex items-center gap-1">
                    <ThumbsUp size={14} className="text-primary fill-primary" /> {currentDetailedPost.likes} lượt thích
                  </span>
                  <span>{currentDetailedPost.comments?.length || 0} bình luận</span>
                </div>

                {/* Like / Share Actions in detail */}
                <div className="flex justify-between border-t border-b border-gray-100 dark:border-gray-700 py-2">
                  <button 
                    onClick={() => handleLike(currentDetailedPost.id)} 
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition-colors ${
                      user && currentDetailedPost.likedBy?.includes(user.id) 
                        ? 'text-primary bg-primary/5' 
                        : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <ThumbsUp size={18} /> Thích
                  </button>
                  <button 
                    onClick={() => handleShare(currentDetailedPost)} 
                    className="flex-1 flex items-center justify-center gap-2 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 py-2 rounded-lg font-medium transition-colors"
                  >
                    <Share2 size={18} /> Chia sẻ
                  </button>
                </div>

                {/* Comments Section */}
                <div className="space-y-4 pt-2">
                  <h4 className="font-bold text-gray-900 dark:text-white">Bình luận</h4>
                  <div className="space-y-3">
                    {currentDetailedPost.comments && currentDetailedPost.comments.length > 0 ? (
                      currentDetailedPost.comments.map(cmt => (
                        <div key={cmt.id} className="flex gap-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 mt-1">
                            {cmt.avatar ? (
                              <img src={cmt.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">{cmt.author.charAt(0)}</div>
                            )}
                          </div>
                          <div className="bg-gray-100 dark:bg-gray-700/50 rounded-2xl px-4 py-2.5 max-w-[85%]">
                            <strong className="block text-sm font-semibold text-gray-900 dark:text-white mb-0.5">{cmt.author}</strong>
                            <span className="text-gray-800 dark:text-gray-200 text-sm">{cmt.content}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-4">Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer / Add Comment */}
              <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40">
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-gray-200">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-400 text-white text-xs font-bold">{user ? user.name.charAt(0) : 'U'}</div>
                    )}
                  </div>
                  <div className="flex-1 relative">
                    <input 
                      type="text" 
                      placeholder="Viết bình luận..."
                      className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full px-4 py-2 text-sm text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      value={commentInput[currentDetailedPost.id] || ''}
                      onChange={(e) => setCommentInput({...commentInput, [currentDetailedPost.id]: e.target.value})}
                      onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit(currentDetailedPost.id)}
                    />
                    <button 
                      onClick={() => handleCommentSubmit(currentDetailedPost.id)}
                      className="absolute right-1 top-1 bottom-1 w-8 h-8 bg-primary hover:bg-primary-dark text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
                    >
                      <Send size={14} className="-ml-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Forum;
