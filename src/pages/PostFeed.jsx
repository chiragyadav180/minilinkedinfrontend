import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const PostFeed = () => {
  const [posts, setPosts] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/feed`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPosts(res.data);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      }
    };

    if (token) {
      fetchFeed();
    }
  }, [token]);

  return (
    <>
      
      <div className="max-w-2xl mx-auto mt-6 px-4">
        <h2 className="text-2xl font-bold mb-4">📢 Public Feed</h2>
        {posts.map((post) => (
          <div key={post._id} className="bg-white shadow p-4 rounded-lg mb-4">
            <p className="text-gray-700">{post.content}</p>
            <div className="text-sm text-gray-500 mt-2">
              by <span className="font-medium">{post.author.name}</span> ·{" "}
              {new Date(post.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default PostFeed;
