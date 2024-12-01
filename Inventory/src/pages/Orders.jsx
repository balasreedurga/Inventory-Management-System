import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../components/Table';

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Fetch orders
    const fetchOrders = async () => {
      try {
        // This would normally be an API call
        // const response = await fetch('/api/orders');
        // const data = await response.json();
        setOrders([
          { 
            id: 'ORD001', 
            date: '2024-03-15', 
            customer: 'John Doe',
            items: ['Product 1', 'Product 2'],
            total: 299.99,
            status: 'pending'
          },
          { 
            id: 'ORD002', 
            date: '2024-03-14', 
            customer: 'Jane Smith',
            items: ['Product 3'],
            total: 149.99,
            status: 'fulfilled'
          },
        ]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const headers = ['Order ID', 'Date', 'Customer', 'Items', 'Total', 'Status', 'Actions'];

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // This would normally call your backend API
      // await fetch(`/api/orders/${orderId}`, {
      //   method: 'PATCH',
      //   body: JSON.stringify({ status: newStatus })
      // });
      console.log(`Changing order ${orderId} status to ${newStatus}`);
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus }
          : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="fulfilled">Fulfilled</option>
        </select>
      </div>

      <Table headers={headers}>
        {filteredOrders.map((order) => (
          <tr key={order.id}>
            <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
            <td className="px-6 py-4 whitespace-nowrap">{order.date}</td>
            <td className="px-6 py-4 whitespace-nowrap">{order.customer}</td>
            <td className="px-6 py-4 whitespace-nowrap">{order.items.join(', ')}</td>
            <td className="px-6 py-4 whitespace-nowrap">${order.total}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                {order.status}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {order.status === 'pending' && (
                <button
                  onClick={() => handleStatusChange(order.id, 'fulfilled')}
                  className="text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                >
                  Mark Fulfilled
                </button>
              )}
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}

export default Orders;
