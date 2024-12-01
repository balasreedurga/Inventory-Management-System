import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 150,
    lowStock: 12,
    totalOrders: 45,
    pendingOrders: 8,
  });

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'order', message: 'New order #1234 received', time: '2 hours ago' },
    { id: 2, type: 'stock', message: 'Low stock alert: Product XYZ', time: '3 hours ago' },
    { id: 3, type: 'product', message: 'New product added: ABC', time: '5 hours ago' },
  ]);

  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        // This would normally be an API call
        // const response = await fetch('/api/dashboard');
        // const data = await response.json();
        // setStats(data.stats);
        // setRecentActivity(data.recentActivity);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleCardClick('/inventory')}
        >
          <h3 className="text-gray-500 text-sm">Total Products</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
        </div>
        
        <div 
          className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleCardClick('/inventory')}
        >
          <h3 className="text-gray-500 text-sm">Low Stock Items</h3>
          <p className="text-2xl font-bold text-red-600">{stats.lowStock}</p>
        </div>
        
        <div 
          className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleCardClick('/orders')}
        >
          <h3 className="text-gray-500 text-sm">Total Orders</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
        </div>
        
        <div 
          className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleCardClick('/orders')}
        >
          <h3 className="text-gray-500 text-sm">Pending Orders</h3>
          <p className="text-2xl font-bold text-orange-600">{stats.pendingOrders}</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="text-gray-800">{activity.message}</p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
