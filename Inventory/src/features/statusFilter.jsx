/**
 * Filters orders based on status.
 * @param {Array} orders - List of order objects.
 * @param {string} status - Status to filter by ('all', 'fulfilled', 'pending').
 * @returns {Array} - Filtered list of orders.
 */
export function filterOrdersByStatus(orders, status) {
    if (status === "all") return orders;
    return orders.filter(order => order.status.toLowerCase() === status.toLowerCase());
  }
  