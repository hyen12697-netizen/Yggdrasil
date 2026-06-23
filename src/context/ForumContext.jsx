import { createContext, useState, useContext } from 'react';

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
  const [posts, setPosts] = useState(initialPosts);
  const [pendingPosts, setPendingPosts] = useState(initialPending);

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
        return { ...p, comments: [...p.comments, { id: Date.now(), ...comment }] };
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
  };

  return (
    <ForumContext.Provider value={{ posts, pendingPosts, addPendingPost, approvePost, rejectPost, addComment, toggleLike, editPost, deletePost }}>
      {children}
    </ForumContext.Provider>
  );
};
