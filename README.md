# Inventory Management

## Overview

Inventory Management is a web application designed to help manage inventory, customers, and users. The application provides different dashboards and functionalities based on user roles (admin, staff, and customer).

## Features

- **Admin Dashboard**: Manage users, view inventory, and customer data.
- **Staff Dashboard**: Manage inventory items, view used items, and customer data.
- **Customer Dashboard**: View used items.
- **User Management**: Add, edit, and delete users.
- **Customer Management**: Add, edit, and delete customers.
- **Inventory Management**: Add, edit, use, and remove inventory items.

## Technologies Used

- **Backend**: Node.js, Express.js, MongoDB
- **Frontend**: HTML, CSS, JavaScript, Bootstrap
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: MongoDB

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/arsalve/Inventory_Management.git
    cd Inventory_Management
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:
    Create a `.env` file in the root directory and add the following variables:
    ```env
    MONGO_URI=your_mongodb_connection_string
    SECRET_KEY=your_jwt_secret_key
    PORT=3000
    ```

4. Start the server:
    ```bash
    npm start
    ```

5. Open your browser and navigate to `http://localhost:3000`.

## API Endpoints

### Authentication

- **POST /api/auth/register**: Register a new user.
- **POST /api/auth/login**: Login a user.
- **GET /api/auth/users**: Get all users (admin only).

### Customers

- **GET /api/customers**: Get all customers (admin and staff only).
- **POST /api/customers/create**: Create a new customer (admin and staff only).

### Inventory

- **GET /api/inventory**: Get all inventory items (admin and staff only).
- **POST /api/inventory/create**: Create a new inventory item (admin and staff only).
- **PUT /api/inventory/use/:id**: Use an inventory item by reducing its quantity (admin and staff only).
- **PUT /api/inventory/remove/:id**: Remove a specific quantity of an inventory item by ID (admin and staff only).
- **GET /api/inventory/used**: Get all used inventory items (admin, staff, and customer).

## Usage

### Admin

1. **Login**: Use the login form to log in as an admin.
2. **Admin Dashboard**: Access the admin dashboard to manage users, view inventory, and customer data.
3. **User Management**: Add, edit, and delete users.
4. **Customer Management**: Add, edit, and delete customers.
5. **Inventory Management**: Add, edit, use, and remove inventory items.

### Staff

1. **Login**: Use the login form to log in as a staff member.
2. **Inventory Dashboard**: Access the inventory dashboard to manage inventory items.
3. **Used Items Dashboard**: View used items.
4. **Customer Management**: Add, edit, and delete customers.

### Customer

1. **Login**: Use the login form to log in as a customer.
2. **Used Items Dashboard**: View used items.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## License

This project is licensed under the MIT License.