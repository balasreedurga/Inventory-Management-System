import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore"; // Include updateDoc and doc for updates
import Table from "../components/Table";

function Inventory() {
  const db = getFirestore();
  const [products, setProducts] = useState([]);
  const headers = ["Name", "SKU", "Price", "Quantity", "Reorder Point", "Status"];

  // Determine stock status
  const isLowStock = (quantity, reorderPoint) => quantity <= reorderPoint;

  useEffect(() => {
    // Fetch products from Firestore
    const fetchProducts = async () => {
      try {
        const productsSnapshot = await getDocs(collection(db, 'products'));
        const productsData = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [db]);

  // Utility to check if a value is a valid number
  const formatPrice = (price) => {
    return typeof price === 'number' && !isNaN(price) ? price.toFixed(2) : 'Invalid price';
  };

  const handleRestockProduct = async (productId, quantityToAdd) => {
    const productRef = doc(db, 'products', productId);
    const product = products.find((p) => p.id === productId);
    if (product) {
      const updatedQuantity = product.quantity + quantityToAdd;
      try {
        await updateDoc(productRef, { quantity: updatedQuantity });
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p.id === productId ? { ...p, quantity: updatedQuantity } : p
          )
        );
      } catch (error) {
        console.error('Error restocking product:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Product Inventory</h1>
        <button
          onClick={() => (window.location.href = "/add-product")}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add New Product
        </button>
      </div>

      <Table headers={headers}>
        {products.map((product) => (
          <tr key={product.id}>
            <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
            <td className="px-6 py-4 whitespace-nowrap">{product.sku}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              €{formatPrice(product.price)}
            </td>
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
