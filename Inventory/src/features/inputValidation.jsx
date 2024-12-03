/**
 * Validates product input data.
 * @param {Object} product - Product object containing input fields.
 * @returns {string} - Validation result.
 */


export const validateProductInput = (fieldName, value, existingSkus = []) => {
  switch (fieldName) {
    case 'name':
      return value.trim() ? '' : 'Name is required';
    case 'sku':
      if (!value.trim()) {
        return 'SKU is required';
      }
      if (existingSkus.includes(value.trim())) {
        return 'SKU must be unique';
      }
      return '';
    case 'price':
      return value > 0 ? '' : 'Price must be greater than 0';
    case 'quantity':
      return value > 0 ? '' : 'Quantity must be greater than 0';
    case 'reorderPoint':
      return value >= 0 ? '' : 'Reorder Point cannot be negative';
    default:
      return '';
  }
};


  