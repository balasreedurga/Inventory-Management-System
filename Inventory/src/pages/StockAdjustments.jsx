import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';

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

  // Error and Success States
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Initialize Firestore
  const db = getFirestore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [db]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state
    setSuccessMessage(null); // Reset success message

    try {
      const { productId, quantity, adjustmentType, reason } = formData;
      const productRef = doc(db, 'products', productId);

      // Fetch the current product data using getDoc instead of getDocs
      const productSnapshot = await getDoc(productRef);  // Using getDoc here

      if (!productSnapshot.exists()) {
        setError('Product not found!');
        return;
      }

      const currentStock = productSnapshot.data().quantity;

      // Calculate the new stock based on the adjustment type
      const newStock = adjustmentType === 'add'
        ? currentStock + parseInt(quantity, 10)
        : currentStock - parseInt(quantity, 10);

      // Ensure the new stock is valid
      if (newStock < 0) {
        setError('Stock cannot be negative!');
        return;
      }

      // Update the stock in Firestore
      await updateDoc(productRef, { quantity: newStock });

      // Show success message
      setSuccessMessage(`Successfully adjusted the stock of ${formData.productId}`);

      // Reset form
      setFormData({
        productId: '',
        quantity: '',
        adjustmentType: 'add',
        reason: ''
      });

      // Navigate to inventory page after a successful adjustment
      navigate('/inventory');
    } catch (error) {
      console.error('Error submitting adjustment:', error);
      setError('There was an error processing your stock adjustment. Please try again.');
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
        {error && <div className="text-red-500 text-sm">{error}</div>}

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
                {product.name} (Current Stock: {product.quantity})
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

      {successMessage && (
        <div className="mt-6 p-4 bg-green-100 border border-green-500 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}
    </div>
  );
}

export default StockAdjustments;
