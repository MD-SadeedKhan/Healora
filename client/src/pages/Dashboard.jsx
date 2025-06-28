import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const fullName = `${user?.firstName || 'User'} ${user?.lastName || ''}`.trim();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg space-y-6">
        <h1 className="text-3xl font-bold">Welcome, {fullName}!</h1>

        {/* Direct navigation to AI Assistant */}
        <button
          onClick={() => navigate("/ai-assistant")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Ask AI Assistant
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          className="bg-red-500 text-white px-6 py-2 rounded-lg shadow hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
