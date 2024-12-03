import { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import Table from '../components/Table';

function Orders() {
  const db = getFirestore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newOrder, setNewOrder] = useState({
    customer: '',
    productNames: [],  // Array of {name, quantity}
    total: 0,
    status: 'pending',
  });
  const [productList, setProductList] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Fetch orders from Firestore
    const fetchOrders = async () => {
      try {
        const ordersSnapshot = await getDocs(collection(db, 'orders'));
        const ordersData = ordersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(ordersData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    // Fetch products for the manual order form
    const fetchProducts = async () => {
      try {
        const productsSnapshot = await getDocs(collection(db, 'products'));
        const productsData = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProductList(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchOrders();
    fetchProducts();
  }, [db]);

  const headers = ['Order ID', 'Date', 'Customer', 'Product Names', 'Total', 'Status', 'Actions'];

  // Filter orders based on status
  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(order => order.status === filter);

  // Handle adding a new order
  const handleAddOrder = async (e) => {
    e.preventDefault();

    // Calculate the total price based on selected products and quantities
    const total = newOrder.productNames.reduce((sum, item) => {
      const product = productList.find(p => p.name === item.name);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);

    const newOrderData = {
      customer: newOrder.customer,
      productNames: newOrder.productNames.map(item => item.name),
      total: total.toFixed(2),
      status: newOrder.status,
      date: new Date().toISOString(),
    };

    try {
      // Add new order to Firestore
      const orderRef = await addDoc(collection(db, 'orders'), newOrderData);

      // Add new order to the local state
      setOrders([
        ...orders,
        { id: orderRef.id, ...newOrderData },
      ]);

      // Reset form
      setNewOrder({
        customer: '',
        productNames: [],
        total: 0,
        status: 'pending',
      });
    } catch (error) {
      console.error('Error adding new order:', error);
    }
  };

  // Handle adding products and quantities to the new order
  const handleAddItemToOrder = (productName, quantity) => {
    const newItem = { name: productName, quantity: parseInt(quantity, 10) };
    setNewOrder(prevOrder => ({
      ...prevOrder,
      productNames: [...prevOrder.productNames, newItem],
    }));
  };

  // Handle updating the total whenever items change
  const handleTotalChange = () => {
    const total = newOrder.productNames.reduce((sum, item) => {
      const product = productList.find(p => p.name === item.name);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
    setNewOrder(prevOrder => ({ ...prevOrder, total: total.toFixed(2) }));
  };

  const handleQuantityChange = (productName, quantity) => {
    setNewOrder(prevOrder => ({
      ...prevOrder,
      productNames: prevOrder.productNames.map(item =>
        item.name === productName ? { ...item, quantity: parseInt(quantity, 10) } : item
      ),
    }));
    handleTotalChange();
  };

  // Handle Mark as Fulfilled Button Click
  const handleMarkAsFulfilled = async (orderId, products) => {
    try {
      const orderRef = doc(db, 'orders', orderId);

      // Update the status of the order to 'fulfilled'
      await updateDoc(orderRef, { status: 'fulfilled' });

      // 1. Update inventory for each product in the order
      for (const item of products) {
        const productRef = doc(db, 'products', item.id); // Get reference to product document
        const product = productList.find(p => p.id === item.id);
        const updatedQuantity = product.quantity - item.quantity;

        if (updatedQuantity >= 0) {
          await updateDoc(productRef, { quantity: updatedQuantity });
        } else {
          console.warn(`Not enough stock for ${product.name}`);
        }
      }

      // Update the local state for orders
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: 'fulfilled' } : order
      ));
    } catch (error) {
      console.error('Error updating order status and inventory:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Add Order Form */}
      <h2 className="text-2xl font-bold text-gray-900">Create New Order</h2>
      <form onSubmit={handleAddOrder} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer Name</label>
            <input
              type="text"
              value={newOrder.customer}
              onChange={(e) => setNewOrder({ ...newOrder, customer: e.target.value })}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>

          {/* Product Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Add Product</label>
            <select
              onChange={(e) => handleAddItemToOrder(e.target.value, 1)} // Default quantity is 1
              className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Select a Product</option>
              {productList.map(product => (
                <option key={product.id} value={product.name}>{product.name} - ${product.price}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Items List */}
        <div>
          <h3 className="text-lg font-medium text-gray-900">Order Items</h3>
          <div className="space-y-4 mt-4">
            {newOrder.productNames.map((item, index) => {
              const product = productList.find(p => p.name === item.name) || {};
              return (
                <div key={index} className="flex justify-between items-center p-4 border border-gray-200 rounded-md">
                  <span>{product.name || 'Product not found'}</span>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.name, e.target.value)}
                    className="w-20 p-2 border border-gray-300 rounded-md"
                  />
                  <span>${(product.price * item.quantity).toFixed(2)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Total */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">Total</label>
          <input
            type="text"
            value={newOrder.total}
            readOnly
            className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-gray-200"
          />
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none"
          >
            Create Order
          </button>
        </div>
      </form>

      {/* Orders Table */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 mt-4"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="fulfilled">Fulfilled</option>
        </select>

        <Table headers={headers}>
          {filteredOrders.map((order) => {
            const uniqueKey = `${(order.productNames && order.productNames.join('-')) || ''}-${order.customer}`;
            return (
              <tr key={uniqueKey}>
                <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(order.date).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order.customer}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.productNames ? order.productNames.join(', ') : 'No products'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">${order.total}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order.status}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.status === 'pending' && (
                    <button
                      className="text-white bg-blue-600 py-1 px-3 rounded-md hover:bg-blue-700"
                      onClick={() => handleMarkAsFulfilled(order.id, order.productNames)}
                    >
                      Mark as Fulfilled
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </Table>
      </div>
    </div>
  );
}

export default Orders;
