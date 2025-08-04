import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-500 shadow-md p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-white">MiniLinkedIn</h1>
      <div className="space-x-4">
        <Link to="/home" className="text-gray-700 hover:text-blue-600 font-medium">
          Home
        </Link>

        {user && (
          <Link to="/profile" className="text-gray-700 hover:text-blue-600 font-medium">
            Profile
          </Link>
        )}

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
