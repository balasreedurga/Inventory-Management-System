import { useState, useEffect } from "react";
import { getProducts, addProduct, updateProduct } from "../backend/products";
import { PencilIcon, CurrencyEuroIcon, TagIcon, ArchiveBoxIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { validateProductInput } from '../features/inputValidation'

function AddProduct( { existingSkus } ) {
  console.log(`inside add product : existingSkus : ${existingSkus}`)
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
    Object.keys(formData).forEach((field) => {
      const errorMessage = validateProductInput(field, formData[field], existingSkus);
      if (errorMessage) {
        newErrors[field] = errorMessage;
      }
    });

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
        <h2 className="text-xl font-bold text-gray-900 mb-6">Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.sku}
              className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg text-gray-800">{product.name}</h3>
                <button
                  onClick={() => handleEdit(product)}
                  className="p-1 text-gray-600 hover:text-green-600 transition-colors"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <TagIcon className="h-5 w-5 mr-2" />
                  <span className="text-sm">SKU: {product.sku}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <CurrencyEuroIcon className="h-5 w-5 mr-2" />
                  <span className="text-sm">€{parseFloat(product.price).toFixed(2)}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <ArchiveBoxIcon className="h-5 w-5 mr-2" />
                  <span className="text-sm">Quantity: {product.quantity}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <ArrowPathIcon className="h-5 w-5 mr-2" />
                  <span className="text-sm">Reorder at: {product.reorderPoint}</span>
                </div>
              </div>
              
              {product.quantity <= product.reorderPoint && (
                <div className="mt-3 text-red-600 text-sm bg-red-50 p-2 rounded">
                  Low stock alert! Time to reorder.
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AddProduct;