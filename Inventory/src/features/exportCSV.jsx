/**
 * Converts an array of objects to CSV format.
 * @param {Array} data - Array of objects to convert.
 * @returns {string} - CSV string.
 */
export function convertToCSV(data) {
    if (!data || data.length === 0) return "";
  
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(","), // Header row
      ...data.map(row => headers.map(header => JSON.stringify(row[header] || "")).join(",")), // Data rows
    ];
  
    return csvRows.join("\n");
  }
  
  /**
   * Triggers a download of the CSV file.
   * @param {string} csvData - CSV string.
   * @param {string} fileName - Name for the downloaded file.
   */
  export function downloadCSV(csvData, fileName = "data.csv") {
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  
    URL.revokeObjectURL(url);
  }
  