import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";
import styled from 'styled-components';

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
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900 text-sm md:text-lg">Product Inventory</h1>
        <button
          onClick={() => (window.location.href = "/add-product")}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm md:text-base"
        >
          Add New Product
        </button>
      </div>

      {/* Make the table horizontally scrollable on small screens */}
      <div className="overflow-x-auto bg-white shadow rounded-md">
        <StyledTable>
          <thead className="bg-blue-600 text-white">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-sm font-medium text-left sm:text-base"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr
                key={product.id}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="px-4 py-3 text-sm sm:text-base sm:px-6 sm:py-4 bg-blue-100">{product.name}</td>
                <td className="px-4 py-3 text-sm sm:text-base sm:px-6 sm:py-4">{product.sku}</td>
                <td className="px-4 py-3 text-sm sm:text-base sm:px-6 sm:py-4">
                  €{formatPrice(product.price)}
                </td>
                <td className="px-4 py-3 text-sm sm:text-base sm:px-6 sm:py-4">{product.quantity}</td>
                <td className="px-4 py-3 text-sm sm:text-base sm:px-6 sm:py-4">{product.reorderPoint}</td>
                <td className="px-4 py-3 text-sm sm:text-base sm:px-6 sm:py-4">
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
          </tbody>
        </StyledTable>
      </div>
    </div>
  );
}

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  @media (max-width: 768px) {
    display: block;
    width: 100%;
    
    thead {
      display: none; /* Hide the table header for smaller screens */
    }
    
    tbody {
      display: block;
      width: 100%;
    }

    tr {
      display: block;
      margin-bottom: 0.5rem;
      padding: 0.5rem;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
    }

    td {
      display: block;
      text-align: right;
      position: relative;
      padding-left: 50%;
      border-bottom: none;
      padding-top: 5px;
    }

    td::before {
      content: attr(data-label);
      position: absolute;
      left: 10px;
      top: 10px;
      font-weight: bold;
      font-size: 0.875rem;
      color: #4b5563;
      text-transform: uppercase;
    }

    td.actions {
      text-align: left;
      padding-top: 5px;
    }

    td.actions button {
      width: 100%;
      margin-top: 0.5rem;
    }
  }
`;

export default Inventory;

