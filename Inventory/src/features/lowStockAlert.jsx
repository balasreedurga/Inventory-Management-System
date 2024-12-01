/**
 * Identifies product IDs that are low in stock.
 * @param {Array} products - List of product objects.
 * @param {number} reorderPoint - The threshold below which stock is considered low.
 * @returns {Array} - List of low-stock product IDs.
 */
export function getLowStockProductIds(products, reorderPoint) {
  return products
    .filter(product => product.quantity < (product.reorderPoint || reorderPoint))
    .map(product => product.id); // Extracting only the IDs
}

  
  /**
   * Generates an alert message for low-stock products.
   * @param {Array} lowStockProducts - List of low-stock product objects.
   * @returns {string} - Alert message for low-stock products.
   */
  export function generateLowStockAlert(lowStockProducts) {
    if (lowStockProducts.length === 0) return "All products are adequately stocked.";
    
    // Extract product IDs and join them in the alert message
    const lowStockProductIds = lowStockProducts.map(product => product.id);
    
    return `Low Stock Alert: The following product IDs are low in stock: ${lowStockProductIds.join(', ')}.`;
  }
  
  