# Inventory-Management-System
React Group project
### **3. Inventory Management System**

**Objective**: Create a tool to help businesses track stock levels, orders, sales, and deliveries.

#### Requirements:

- **Product Inventory**: Display a list of products with stock levels and reorder points.
- **Add New Products**: Allow users to add new products with details like name, SKU, price, and quantity.
- **Stock Adjustments**: Enable users to update stock levels when products are sold or restocked.
- **Order Management**: Show recent orders and allow users to mark them as fulfilled.

#### Optional Features:

- Add a low-stock alert for items below a specified level.
- Implement simple analytics, like total sales or top-selling products.
- Export inventory data as a CSV file.
1

2

3

4

Collaborator Roles and Responsibilities
1. Collaborator 1: Backend Developer
•Focus on Firebase integration, database structure, and backend operations.
2. Collaborator 2: UI Developer
•Design and implement the layout and static components for the application.
3. Collaborator 3: Feature Developer
•Implement dynamic features such as stock adjustments, low-stock alerts, and 
analytics.
Progressive Work Plan
Phase 1: Setup and Initial Development
Collaborator 1: Backend Developer
•Step 1: Configure Firebase project.
•Create Firestore database and set up required collections:
•products: { name, sku, price, quantity, 
reorderPoint }
•orders: { productIds, totalPrice, status }
•Initialize Firebase app in the project and add environment variables for keys.
•Step 2: Write reusable Firebase utility functions.
•fetchData(collectionName)
•addData(collectionName, data)
•updateData(collectionName, docId, updates)
Collaborator 2: UI Developer
•Step 1: Set up Vite with React.js.
•Install dependencies: react-router-dom, tailwindcss (optional for styling).
•Step 2: Create routing structure with placeholders.
•Define basic routes for:
•Dashboard (/dashboard)
•Product Inventory (/inventory)
•Add Product (/add-product)
•Stock Adjustments (/stock-adjustments)
•Order Management (/orders)
•Step 3: Implement Navbar for navigation.
Collaborator 3: Feature Developer
•Step 1: Collaborate with Backend Developer to define API payloads for:
•Fetching products.
•Adding new products.
•Updating stock levels.
•Managing orders.
Phase 2: Product Inventory and Adding Products
Collaborator 1: Backend Developer
•Step 1: Implement Firestore logic for products.
•Fetch all products from the products collection.
•Add new products to the products collection.
•Step 2: Provide functions for UI integration.
•getProducts(): Fetch product data.
•addProduct(product): Add a new product.
Collaborator 2: UI Developer
•Step 1: Build Product Inventory page (/inventory).
•Create a table layout to display:
•Product name, SKU, price, quantity, and reorder point.
•Highlight low-stock items.
•Step 2: Build Add Product page (/add-product).
•Create a form for adding new products with:
•Fields: Name, SKU, Price, Quantity, Reorder Point.
•Submit button to call backend function.
Collaborator 3: Feature Developer
•Step 1: Implement low-stock alert feature.
•Identify products with quantity < reorderPoint.
•Display an alert banner or badge for such products.
•Step 2: Enhance Add Product page with validation.
•Ensure non-negative quantities and valid inputs before submission.
Phase 3: Stock Adjustments and Orders
Collaborator 1: Backend Developer
•Step 1: Implement Firestore logic for stock adjustments.
•Fetch a product by ID and update its quantity.
•Step 2: Create Firestore logic for orders.
•Fetch orders from the orders collection.
•Update order status (e.g., mark as fulfilled).
Collaborator 2: UI Developer
•Step 1: Build Stock Adjustments page (/stock-adjustments).
•Dropdown to select a product.
•Input field for adjustment quantity.
•Submit button to call backend function.
•Step 2: Build Order Management page (/orders).
•Table to display order details:
•Order ID, Product(s), Total Price, Status.
•Button to mark orders as fulfilled.
Collaborator 3: Feature Developer
•Step 1: Enhance Stock Adjustments with real-time validation.
•Prevent negative stock levels.
•Step 2: Add a status filter for orders.
•Options: All Orders, Fulfilled, Pending.
Phase 4: Advanced Features and Integration
Collaborator 1: Backend Developer
•Step 1: Provide analytics data.
•Total sales: Sum of totalPrice for fulfilled orders.
•Top-selling products: Aggregate sales by product ID.
•Step 2: Create Firestore logic for exporting data.
•Fetch data from Firestore collections and structure it for export.
Collaborator 2: UI Developer
•Step 1: Build Analytics Section (part of /dashboard).
•Display total sales and top-selling products.
•Step 2: Add CSV export button to the Product Inventory page.
Collaborator 3: Feature Developer
•Step 1: Implement CSV export functionality.
•Convert Firestore data to CSV format and trigger download.
•Step 2: Enhance Analytics with visualizations (optional).
•Use a library like Chart.js or Recharts to create bar/line charts.
Collaboration Workflow
1. Daily Workflow
•Morning stand-up: Share progress and discuss blockers.
•Use a project board (Trello, GitHub Projects) to track tasks.
2. Git Workflow
•Create feature branches for each task (e.g., feature/inventory).
•Merge branches via pull requests with clear descriptions.
3. Integration Points
•Collaborator 1 (Backend Developer) to provide APIs early for UI integration.
•Collaborator 2 (UI Developer) to share reusable components for Collaborator 3.
•Collaborator 3 (Feature Developer) to integrate advanced features into completed UI.