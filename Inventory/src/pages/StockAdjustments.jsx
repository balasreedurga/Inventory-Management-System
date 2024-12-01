import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function StockAdjustments() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    adjustmentType: 'add',
    reason: ''
  });

  useEffect(() => {
    // Fetch products
    const fetchProducts = async () => {
      try {
        // This would normally be an API call
        // const response = await fetch('/api/products');
        // const data = await response.json();
        setProducts([
          { id: 1, name: 'Product 1', currentStock: 50 },
          { id: 2, name: 'Product 2', currentStock: 30 },
        ]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // This would normally call your backend API
      // await fetch('/api/stock-adjustments', {
      //   method: 'POST',
      //   body: JSON.stringify(formData)
      // });
      console.log('Stock adjustment:', formData);
      
      // Reset form
      setFormData({
        productId: '',
        quantity: '',
        adjustmentType: 'add',
        reason: ''
      });

      // Navigate to inventory page after successful adjustment
      navigate('/inventory');
    } catch (error) {
      console.error('Error submitting adjustment:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Stock Adjustments</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Select Product</label>
          <select
            name="productId"
            value={formData.productId}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Select a product</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name} (Current Stock: {product.currentStock})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Adjustment Type</label>
          <select
            name="adjustmentType"
            value={formData.adjustmentType}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="add">Add Stock</option>
            <option value="remove">Remove Stock</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Reason</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows="3"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          ></textarea>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Submit Adjustment
          </button>
        </div>
      </form>
    </div>
  );
}

export default StockAdjustments;
