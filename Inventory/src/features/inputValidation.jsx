export const validateProductInput = (fieldName, value, existingSkus = []) => {
  const isValidNumber = (value) => !isNaN(Number(value)); // Convert to number and check for NaN
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
      if (!isValidNumber(value)) {
        return 'Price must be a valid number';
      }
      return value > 0 ? '' : 'Price must be greater than 0';

    case 'quantity':
      if (!isValidNumber(value)) {
        return 'Quantity must be a valid number';
      }
      return value > 0 ? '' : 'Quantity must be greater than 0';

    case 'reorderPoint':
      if (value === '' || value === null || value === undefined) {
        return 'Reorder Point is required! enter any non-negative value';
      }
      
      // Ensure the value is a valid number
      if (!isValidNumber(value)) {
        return 'ReorderPoint must be a valid number';
      }
      
      // Ensure it's not negative
      return value >= 0 ? value : 'Reorder Point cannot be negative';
    default:
      return '';
  }
};
