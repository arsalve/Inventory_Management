# Inventory Management Tool

## Overview
The Inventory Management Tool is a web application designed to help businesses manage their inventory efficiently. It provides features for tracking used items, generating reports, and managing users and customers.

## Features
- Inventory Dashboard
- Used Items Dashboard
- Customer Management
- User Management
- Detailed Reports with Insights
- Dark Theme for Plotly Graphs

## Recent Updates
### Used Items Dashboard
- Added a new column "Used By" to the used items table.
- Removed the "Customer Name" column from the used items table.
- Updated the second Plotly graph to show data based on the "Used By" section.
- Applied a dark theme to the Plotly graphs for better visual consistency with the overall application theme.

## Prerequisites

Before you start, make sure you have the following installed on your computer:
1. Node.js (v14 or higher)
2. npm (v6 or higher)
3. A MongoDB Atlas account

## Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/inventory-management-tool.git
    ```
2. Navigate to the project directory:
    ```bash
    cd inventory-management-tool
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```

## Usage
1. Start the development server:
    ```bash
    npm start
    ```
2. Open your browser and navigate to `http://localhost:3000`.

## Step-by-Step Instructions

### 1. Clone the Repository

1. Open your web browser and go to the GitHub repository page.
2. Click on the "Code" button and copy the repository URL.
3. Open a terminal or command prompt on your computer.
4. Type the following command and press Enter:
   ```sh
   git clone <repository-url>
   ```

### 2. Navigate to the Project Directory

1. In the terminal or command prompt, type the following command and press Enter:
   ```sh
   cd inventory-management-tool
   ```

### 3. Install the Dependencies

1. In the terminal or command prompt, type the following command and press Enter:
   ```sh
   npm install
   ```

### 4. Create a `.env` File

1. In the root directory of the project, create a new file named `.env`.
2. Open the `.env` file in a text editor and add the following lines:
   ```properties
   MONGO_URI=mongodb://localhost:27017/inventory_management
   PORT=3000
   SECRET_KEY=your_secret_key_here
   ```

### 5. Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.
2. Create a new project.
3. Create a new cluster.
4. In the cluster, click on "Connect" and follow the instructions to whitelist your IP address and create a database user.
5. Choose "Connect your application" and copy the connection string. It will look something like this:
   ```
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/inventory_management?retryWrites=true&w=majority
   ```
6. Replace `<username>` and `<password>` with the database user credentials you created.

### 6. Initialize the Application

1. In the terminal or command prompt, type the following command and press Enter:
   ```sh
   npm run init
   ```

### 7. Access the Inventory Management Tool

1. Open your web browser and navigate to `http://localhost:3000` to access the inventory management tool.

## Project Structure

```
inventory-management-tool
├── src
│   ├── controllers
│   │   ├── authController.js
│   │   ├── customerController.js
│   │   ├── inventoryController.js
│   ├── middleware
│   │   ├── authMiddleware.js
│   ├── models
│   │   ├── customerModel.js
│   │   ├── inventoryModel.js
│   │   ├── userModel.js
│   ├── routes
│   │   ├── authRoutes.js
│   │   ├── customerRoutes.js
│   │   ├── inventoryRoutes.js
│   ├── views
│   │   ├── index.html
│   │   ├── dashboard.html
│   │   ├── admin-dashboard.html
│   │   ├── used-items.html
│   │   ├── add-user.html
│   │   ├── customer-management.html
│   │   ├── user-management.html
│   │   ├── scripts
│   │   │   ├── login.js
│   │   │   ├── customer-management.js
│   │   │   ├── used-items.js
│   │   │   ├── dashboard.js
│   ├── app.js
├── package.json
├── .env
├── .gitignore
├── init.js
```
## Authentication
- POST /api/auth/register: Register a new user.
- POST /api/auth/login: Login a user.
- GET /api/auth/users: Get all users (admin only).

## API Endpoints

- GET /api/inventory: Get all inventory items (admin and staff only).
- POST /api/inventory/create: Create a new inventory item (admin and staff only).
- PUT /api/inventory/use/:id: Use an inventory item by reducing its quantity (admin and staff only).
- PUT /api/inventory/remove/:id: Remove a specific quantity of an inventory item by ID (admin and staff only).
- GET /api/inventory/used: Get all used inventory items (admin, staff, and customer).
- `/api/auth/login` - Authenticate user and obtain a token.
- `/api/inventory/used` - Fetch used items data.

## Resources

- [Node.js](https://nodejs.org/en/docs/) - JavaScript runtime built on Chrome's V8 JavaScript engine.
- [Express](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js.
- [MongoDB](https://www.mongodb.com/) - NoSQL database for modern applications.
- [Mongoose](https://mongoosejs.com/) - Elegant MongoDB object modeling for Node.js.
- [dotenv](https://www.npmjs.com/package/dotenv) - Module that loads environment variables from a `.env` file into `process.env`.
- [Bootstrap](https://getbootstrap.com/) - The most popular HTML, CSS, and JS library in the world.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.