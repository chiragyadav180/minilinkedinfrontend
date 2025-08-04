import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import axios from 'axios';

const PostItem = ({ post, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      await onUpdate(post._id, editedContent);
      setIsEditing(false);
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        setIsLoading(true);
        await onDelete(post._id);
      } catch (err) {
        console.error('Delete failed:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      {isEditing ? (
        <div className="space-y-3">
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              disabled={isLoading || !editedContent.trim()}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-gray-800">{post.content}</p>
          <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
            <span>
              {new Date(post.createdAt).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
            <div className="space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="text-indigo-600 hover:text-indigo-800"
                disabled={isLoading}
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="text-red-600 hover:text-red-800"
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const ProfilePage = () => {
  const { user: authUser, loading: authLoading, token } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('posts');

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/profile/${authUser.id}`);
      setProfileData(res.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePost = async (postId, newContent) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/posts/${postId}`,
        { content: newContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setProfileData(prev => ({
        ...prev,
        posts: prev.posts.map(post => 
          post._id === postId ? { ...post, content: newContent } : post
        )
      }));
      
      return res.data;
    } catch (err) {
      console.error('Update error:', err);
      throw err;
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setProfileData(prev => ({
        ...prev,
        posts: prev.posts.filter(post => post._id !== postId)
      }));
    } catch (err) {
      console.error('Delete error:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (!authLoading && authUser && authUser.id) {
      fetchProfile();
    }
  }, [authLoading, authUser]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-32"></div>
          <div className="px-6 pb-6 relative">
            <div className="flex items-end -mt-16">
              <div className="h-24 w-24 rounded-full border-4 border-white bg-white flex items-center justify-center shadow-md">
                <span className="text-3xl font-bold text-indigo-600">
                  {profileData.user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-6">
                <h1 className="text-2xl font-bold text-gray-900">{profileData.user.name}</h1>
                <p className="text-gray-600">{profileData.user.email}</p>
              </div>
            </div>
            
            {profileData.user.bio && (
              <div className="mt-4">
                <p className="text-gray-700">{profileData.user.bio}</p>
              </div>
            )}

            <div className="mt-4 flex items-center text-sm text-gray-500">
              <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              Joined {new Date(profileData.user.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('posts')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'posts'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'about'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              About
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'posts' ? (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Your Posts</h2>
              {profileData.posts.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                  <p className="text-gray-500">You haven't created any posts yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {profileData.posts.map(post => (
                    <PostItem 
                      key={post._id} 
                      post={post} 
                      onUpdate={handleUpdatePost}
                      onDelete={handleDeletePost}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1 text-gray-900">{profileData.user.email}</p>
                </div>
                {profileData.user.bio && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Bio</h3>
                    <p className="mt-1 text-gray-900">{profileData.user.bio}</p>
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
                  <p className="mt-1 text-gray-900">
                    {new Date(profileData.user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;