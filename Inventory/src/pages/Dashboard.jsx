import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore';

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    totalOrders: 0,
    pendingOrders: 0,
    fulfilledOrders: 0, // New stat for fulfilled orders
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const db = getFirestore();

  // Define stock threshold for low stock
  const lowStockThreshold = 10;

  useEffect(() => {
    // Fetch Products data with realtime updates
    const fetchProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      const products = snapshot.docs.map(doc => doc.data());
      const totalProducts = products.length;
      const lowStockItems = products.filter(product => product.quantity <= lowStockThreshold).length;

      setStats(prevStats => ({
        ...prevStats,
        totalProducts,
        lowStock: lowStockItems,
      }));
    });

    // Fetch Orders data with realtime updates
    const fetchOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const orders = snapshot.docs.map(doc => doc.data());
      const totalOrders = orders.length;
      const pendingOrders = orders.filter(order => order.status === 'pending').length;
      const fulfilledOrders = orders.filter(order => order.status === 'fulfilled').length;

      // Update the stats with orders data
      setStats(prevStats => ({
        ...prevStats,
        totalOrders,
        pendingOrders,
        fulfilledOrders,
      }));

      // Update recent activity with the latest orders
      const recentOrders = orders.slice(0, 5); // Get the 5 most recent orders
      const recentActivities = recentOrders.map(order => ({
        id: order.id,
        message: `${order.customer} ${order.status === 'pending' ? 'placed' : 'fulfilled'} an order`,
        time: new Date(order.date).toLocaleString(),
      }));

      setRecentActivity(recentActivities);
    });

    // Cleanup listeners when the component is unmounted
    return () => {
      fetchProducts(); // Unsubscribe from products collection
      fetchOrders();   // Unsubscribe from orders collection
    };
  }, [db]);

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

        <div 
          className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleCardClick('/orders')}
        >
          <h3 className="text-gray-500 text-sm">Fulfilled Orders</h3>
          <p className="text-2xl font-bold text-green-600">{stats.fulfilledOrders}</p>
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

