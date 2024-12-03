import { useState, useEffect } from "react";
import { getProducts, addProduct, updateProduct } from "../backend/products";

function AddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: "",
    quantity: "",
    reorderPoint: "",
  });

  const [products, setProducts] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch products in real-time
  useEffect(() => {
    const unsubscribe = getProducts((data) => {
      setProducts(data);
    });
    return () => unsubscribe();
  }, []);

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = "Product name is required.";
    if (!formData.sku) newErrors.sku = "SKU is required.";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Price must be greater than zero.";
    if (!formData.quantity || formData.quantity < 0)
      newErrors.quantity = "Quantity cannot be negative.";
    if (!formData.reorderPoint || formData.reorderPoint < 0)
      newErrors.reorderPoint = "Reorder point cannot be negative.";

    if (
      !editMode &&
      products.some((product) => product.sku === formData.sku)
    ) {
      newErrors.sku = "SKU must be unique.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle product editing
  const handleEdit = (product) => {
    setEditMode(true);
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      reorderPoint: product.reorderPoint.toString(),
    });
  };

  // Reset form after adding/updating a product
  const resetForm = () => {
    setFormData({
      name: "",
      sku: "",
      price: "",
      quantity: "",
      reorderPoint: "",
    });
    setEditMode(false);
    setSelectedProduct(null);
    setErrors({});
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const updatedProductData = {
        name: formData.name,
        sku: formData.sku,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity, 10),
        reorderPoint: parseInt(formData.reorderPoint, 10),
      };

      if (editMode) {
        
        await updateProduct(formData.sku, updatedProductData);
        console.log("Product updated successfully!");
      } else {
        await addProduct(updatedProductData);
        console.log("Product added successfully!");
      }

      resetForm();
    } catch (error) {
      console.error("Error saving product:", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {editMode ? "Edit Product" : "Add New Product"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.name ? "border-red-500" : ""
            }`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
            SKU
          </label>
          <input
            type="text"
            name="sku"
            id="sku"
            value={formData.sku}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.sku ? "border-red-500" : ""
            }`}
          />
          {errors.sku && <p className="mt-1 text-sm text-red-600">{errors.sku}</p>}
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            name="price"
            id="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.price ? "border-red-500" : ""
            }`}
          />
          {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
            Quantity
          </label>
          <input
            type="number"
            name="quantity"
            id="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="0"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.quantity ? "border-red-500" : ""
            }`}
          />
          {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>}
        </div>

        <div>
          <label htmlFor="reorderPoint" className="block text-sm font-medium text-gray-700">
            Reorder Point
          </label>
          <input
            type="number"
            name="reorderPoint"
            id="reorderPoint"
            value={formData.reorderPoint}
            onChange={handleChange}
            min="0"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.reorderPoint ? "border-red-500" : ""
            }`}
          />
          {errors.reorderPoint && <p className="mt-1 text-sm text-red-600">{errors.reorderPoint}</p>}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : editMode
              ? "Save Changes"
              : "Add Product"}
          </button>
        </div>
      </form>

      {/* List of Products */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900">Products</h2>
        <ul className="mt-4 space-y-4">
          {products.map((product) => (
            <li key={product.sku} className="p-4 border rounded-md">
              <p>
                <strong>Name:</strong> {product.name}
              </p>
              <p>
                <strong>SKU:</strong> {product.sku}
              </p>
              <p>
        <strong>Price:</strong> €{parseFloat(product.price).toFixed(2)}
      </p>
              <p>
                <strong>Quantity:</strong> {product.quantity}
              </p>
              <p>
                <strong>Reorder Point:</strong> {product.reorderPoint}
              </p>
              <button
                onClick={() => handleEdit(product)}
                className="mt-2 bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700"
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AddProduct;
