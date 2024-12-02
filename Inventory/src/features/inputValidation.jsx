/**
 * Validates product input data.
 * @param {Object} product - Product object containing input fields.
 * @returns {Object} - Validation result: { isValid: boolean, errors: Object }
 */
// export function validateProductInput(product) {
//     const errors = {};
//     if (!product.name || product.name.trim() === "") errors.name = "Name is required.";
//     if (!product.sku || product.sku.trim() === "") errors.sku = "SKU is required.";
//     if (!product.price || product.price <= 0) errors.price = "Price must be a positive number.";
//     if (!Number.isInteger(product.quantity) || product.quantity < 0)
//       errors.quantity = "Quantity must be a non-negative integer.";
//     if (!product.reorderPoint || product.reorderPoint < 0)
//       errors.reorderPoint = "Reorder point must be a non-negative number.";
  
//     return {
//       isValid: Object.keys(errors).length === 0,
//       errors,
//     };
//   }

export const validateProductInput = (fieldName, value) => {
  switch (fieldName) {
    case 'name':
      return value.trim() ? '' : 'Name is required';
    case 'sku':
      return value.trim() ? '' : 'SKU is required';
    case 'price':
      return value > 0 ? '' : 'Price must be greater than 0';
    case 'quantity':
      return value >= 0 ? '' : 'Quantity cannot be negative';
    case 'reorderPoint':
      return value >= 0 ? '' : 'Reorder Point cannot be negative';
    default:
      return '';
  }
};

  