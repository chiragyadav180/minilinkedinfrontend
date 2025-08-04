import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState("");
  const { user, token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/posts`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setContent("");
      onPostCreated?.(res.data);
    } catch (err) {
      console.error("Failed to create post:", err);
    }
  };

  if (!user) return null;

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded-lg mb-6">
      <textarea
        className="w-full p-2 border rounded mb-2"
        rows={3}
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Post
      </button>
    </form>
  );
};

export default CreatePost;
