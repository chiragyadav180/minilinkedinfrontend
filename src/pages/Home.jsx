import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import CreatePost from '../components/CreatePost';
import PostFeed from './PostFeed';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      navigate('/login');
    } else {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
    }
  }, [navigate]);

  const handleNewPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8 p-6 bg-white rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome back, <span className="text-indigo-600">{user?.name}</span> 👋
          </h2>
          <p className="text-gray-500">What's on your mind today?</p>
        </div>

        <div className="mb-8">
          <CreatePost onPostCreated={handleNewPost} />
        </div>

        <div className="space-y-6">
          <PostFeed />
        </div>
      </div>
    </div>
  );
};

export default Home;