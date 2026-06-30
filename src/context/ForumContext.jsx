import { createContext, useState, useContext, useEffect } from 'react';

const ForumContext = createContext();

export const useForum = () => useContext(ForumContext);

const initialPosts = [
  {
    id: 1,
    author: 'Nguyễn Văn Nông',
    avatar: 'N',
    time: '2 giờ trước',
    createdAt: Date.now() - 2 * 60 * 60 * 1000,
    content: 'Chào bà con, mùa này sầu riêng nhà tôi đang ra hoa nhưng rụng nhiều quá, không biết dùng loại phân bón lá nào hay chế phẩm gì để chống rụng trái non hiệu quả ạ? Nhờ bà con và admin tư vấn giúp. Cảm ơn nhiều!',
    likes: 24,
    likedBy: [],
    comments: [
      { id: 1, author: 'Admin Yggdrasil', content: 'Chào bạn, bạn có thể tham khảo phân bón vi lượng Bo của shop để chống rụng nhé!' }
    ]
  },
  {
    id: 2,
    author: 'Trần Thị Lý',
    avatar: 'T',
    time: '5 giờ trước',
    createdAt: Date.now() - 5 * 60 * 60 * 1000,
    content: 'Tuyệt vời quá! Vừa dùng thử bộ chế phẩm sinh học Trichoderma của Yggdrasil cho vườn tiêu. Cây xanh tốt hẳn, rễ bung mạnh. Sẽ tiếp tục ủng hộ shop lâu dài.',
    image: '/banner.png',
    likes: 156,
    likedBy: [],
    comments: []
  }
];

const initialPending = [
  {
    id: 3,
    author: 'Lê Văn C',
    avatar: 'C',
    time: '10 phút trước',
    createdAt: Date.now() - 10 * 60 * 1000,
    content: 'Phân gà ủ vi sinh dùng cho cây mai được không shop?',
    likes: 0,
    likedBy: [],
    comments: []
  }
];

export const ForumProvider = ({ children }) => {
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('yggdrasil_forum_posts');
    return saved ? JSON.parse(saved) : initialPosts;
  });

  const [pendingPosts, setPendingPosts] = useState(() => {
    const saved = localStorage.getItem('yggdrasil_forum_pending');
    return saved ? JSON.parse(saved) : initialPending;
  });

  const [reports, setReports] = useState(() => {
    const saved = localStorage.getItem('yggdrasil_forum_reports');
    return saved ? JSON.parse(saved) : [];
  });

  const saveToStorage = (key, data, limit = 50) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.warn(`LocalStorage quota exceeded for ${key}. Saving limited data.`, error);
      if (Array.isArray(data) && data.length > limit) {
        try {
          // Keep only the most recent items
          localStorage.setItem(key, JSON.stringify(data.slice(0, limit)));
        } catch (e) {
          console.error(`Still failing to save ${key}.`, e);
        }
      }
    }
  };

  // Sync to localStorage
  useEffect(() => {
    saveToStorage('yggdrasil_forum_posts', posts);
  }, [posts]);

  useEffect(() => {
    saveToStorage('yggdrasil_forum_pending', pendingPosts);
  }, [pendingPosts]);

  useEffect(() => {
    saveToStorage('yggdrasil_forum_reports', reports);
  }, [reports]);

  const addPendingPost = (post) => {
    setPendingPosts([{ ...post, id: Date.now(), createdAt: Date.now(), likes: 0, likedBy: [], comments: [] }, ...pendingPosts]);
  };

  const approvePost = (id) => {
    const post = pendingPosts.find(p => p.id === id);
    if (post) {
      setPosts([{ ...post, time: 'Vừa xong', createdAt: Date.now() }, ...posts]);
      setPendingPosts(pendingPosts.filter(p => p.id !== id));
    }
  };

  const rejectPost = (id) => {
    setPendingPosts(pendingPosts.filter(p => p.id !== id));
  };

  const addComment = (postId, comment) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return { ...p, comments: [...(p.comments || []), { id: Date.now(), createdAt: Date.now(), ...comment, isHidden: false }] };
      }
      return p;
    }));
  };

  const deleteComment = (postId, commentId) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return { ...p, comments: (p.comments || []).filter(c => c.id !== commentId) };
      }
      return p;
    }));
    // Remove any reports for this comment
    setReports(reports.filter(r => !(r.targetId === commentId && r.type === 'comment')));
  };

  const editComment = (postId, commentId, updatedContent) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: (p.comments || []).map(c => c.id === commentId ? { ...c, content: updatedContent } : c)
        };
      }
      return p;
    }));
  };

  const toggleHideComment = (postId, commentId) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: (p.comments || []).map(c => c.id === commentId ? { ...c, isHidden: !c.isHidden } : c)
        };
      }
      return p;
    }));
  };

  const toggleLike = (postId, userId) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        const hasLiked = p.likedBy.includes(userId);
        return {
          ...p,
          likedBy: hasLiked ? p.likedBy.filter(id => id !== userId) : [...p.likedBy, userId],
          likes: hasLiked ? p.likes - 1 : p.likes + 1
        };
      }
      return p;
    }));
  };

  const editPost = (postId, updatedData) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, ...updatedData } : p));
    setPendingPosts(pendingPosts.map(p => p.id === postId ? { ...p, ...updatedData } : p));
  };

  const deletePost = (postId) => {
    setPosts(posts.filter(p => p.id !== postId));
    setPendingPosts(pendingPosts.filter(p => p.id !== postId));
    // Remove any reports for this post
    setReports(reports.filter(r => !(r.targetId === postId && r.type === 'post')));
  };

  const reportContent = (type, targetId, reason, author, contentSnippet) => {
    const newReport = {
      id: Date.now(),
      type, // 'post' or 'comment'
      targetId,
      reason,
      reporter: author,
      contentSnippet,
      createdAt: Date.now()
    };
    setReports([newReport, ...reports]);
  };

  const resolveReport = (reportId) => {
    setReports(reports.filter(r => r.id !== reportId));
  };

  return (
    <ForumContext.Provider value={{ 
      posts, pendingPosts, reports, 
      addPendingPost, approvePost, rejectPost, 
      addComment, deleteComment, toggleHideComment, editComment,
      toggleLike, editPost, deletePost,
      reportContent, resolveReport
    }}>
      {children}
    </ForumContext.Provider>
  );
};
