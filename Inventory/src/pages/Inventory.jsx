import { useEffect, useState } from 'react';
import Table from '../components/Table';
import { getLowStockProductIds, generateLowStockAlert } from '/src/features/lowStockAlert';

function Inventory() {
  // This would normally come from your backend
  const [products] = useState([
    { id: 1, name: 'Product 1', sku: 'SKU001', price: 29.99, quantity: 5, reorderPoint: 10 },
    { id: 2, name: 'Product 2', sku: 'SKU002', price: 39.99, quantity: 15, reorderPoint: 8 },
  ]);

  const [lowStockProductIds, setLowStockProductIds] = useState([]);

  // Check for low stock when products load
  useEffect(() => {
    const ids = getLowStockProductIds(products);
    setLowStockProductIds(ids); // Update state with low-stock product IDs
  }, [products]); // Run whenever `products` changes

  // Generate low stock alert
  const alertMessage = generateLowStockAlert(lowStockProductIds);

  const headers = ['Name', 'SKU', 'Price', 'Quantity', 'Reorder Point', 'Status'];

  const isLowStock = (quantity, reorderPoint) => quantity <= reorderPoint;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Product Inventory</h1>
        <button
          onClick={() => window.location.href = '/add-product'}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add New Product
        </button>
      </div>

      {/* Low Stock Alert */}
      <div className="alert alert-warning bg-yellow-100 text-yellow-800 p-4 rounded">
        {alertMessage}
      </div>

      <Table headers={headers}>
        {products.map((product) => (
          <tr key={product.id}>
            <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
            <td className="px-6 py-4 whitespace-nowrap">{product.sku}</td>
            <td className="px-6 py-4 whitespace-nowrap">${product.price}</td>
            <td className="px-6 py-4 whitespace-nowrap">{product.quantity}</td>
            <td className="px-6 py-4 whitespace-nowrap">{product.reorderPoint}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              {isLowStock(product.quantity, product.reorderPoint) ? (
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                  Low Stock
                </span>
              ) : (
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  In Stock
                </span>
              )}
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}

export default Inventory;
