/**
 * Show the loading modal.
 */
function showLoading() {
    $('#loadingModal').modal('show');
}

/**
 * Hide the loading modal.
 */
function hideLoading() {
    $('#loadingModal').modal('hide');
}

// Function to get the token from local storage
function getToken() {
    return localStorage.getItem('token');
}

// Function to get the user's role from the token
function getUserRole() {
    const token = getToken();
    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role;
    }
    return null;
}

// Display user role in the header
function displayUserRole() {
    const role = getUserRole();
    const userRoleBox = document.getElementById('userRoleBox');
    if (userRoleBox && role) {
        userRoleBox.textContent = role.charAt(0).toUpperCase() + role.slice(1) + ' User';
    }
}

// Call displayUserRole when the page loads
displayUserRole();



/**
 * Fetch all inventory items and populate the table.
 */
async function fetchItems() {
    showLoading();
    const response = await fetch('/api/inventory', {
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    });
    const items = await response.json();
    const tableBody = document.getElementById('inventoryTable').querySelector('tbody');
    tableBody.innerHTML = '';

    items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.price}</td>
            <td>${item.receivePrice}</td>
            <td>${item.sellPrice}</td>
            <td>${new Date(item.addedDate).toLocaleDateString()}</td>
            <td>${item.itemType}</td>
            <td>
                <button class="btn btn-warning btn-sm" data-toggle="modal" data-target="#useItemModal" onclick="setUseItemId('${item._id}')">Use</button>
                <button class="btn btn-danger btn-sm" data-toggle="modal" data-target="#removeItemModal" onclick="setRemoveItemId('${item._id}')">Remove</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    hideLoading();
}

/**
 * Set the item ID for the use item modal.
 * @param {string} id - The item ID.
 */
function setUseItemId(id) {
    document.getElementById('useItemId').value = id;
}

/**
 * Set the item ID for the remove item modal.
 * @param {string} id - The item ID.
 */
function setRemoveItemId(id) {
    document.getElementById('removeItemId').value = id;
}

/**
 * Fetch all customers and populate the customer dropdown.
 */
async function fetchCustomersForDropdown() {
    const token = getToken();
    if (!token) {
        alert('You are not authorized. Please log in.');
        window.location.href = 'login.html';
        return;
    }

    const response = await fetch('/api/customers', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (response.status === 401) {
        alert('You are not authorized. Please log in.');
        window.location.href = 'login.html';
        return;
    }

    const customers = await response.json();
    const customerSelect = document.getElementById('customerSelect');
    customerSelect.innerHTML = '<option value="" disabled selected>Select Customer</option>';

    customers.forEach(customer => {
        const option = document.createElement('option');
        option.value = customer._id;
        option.textContent = customer.name;
        customerSelect.appendChild(option);
    });
}

/**
 * Fetch all suppliers and populate the supplier dropdown.
 */
async function fetchSuppliersForDropdown() {
    const token = getToken();
    if (!token) {
        alert('You are not authorized. Please log in.');
        window.location.href = 'login.html';
        return;
    }

    const response = await fetch('/api/suppliers', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (response.status === 401) {
        alert('You are not authorized. Please log in.');
        window.location.href = 'login.html';
        return;
    }

    const suppliers = await response.json();
    const supplierSelect = document.getElementById('supplierSelect');
    supplierSelect.innerHTML = '<option value="" disabled selected>Select Supplier</option>';

    suppliers.forEach(supplier => {
        const option = document.createElement('option');
        option.value = supplier._id;
        option.textContent = supplier.name;
        supplierSelect.appendChild(option);
    });
}

// Fetch items, customers, and suppliers when the page loads
fetchItems();
fetchCustomersForDropdown();
fetchSuppliersForDropdown();

// Function to create a new inventory item
async function createInventoryItem(name, quantity, price, receivePrice, sellPrice, itemType) {
    const token = getToken();
    if (!token) {
        alert('You are not authorized. Please log in.');
        window.location.href = 'login.html';
        return;
    }

    const addedDate = document.getElementById('addedDate').value;

    // Check if the item type is new
    const isNewType = await fetch(`/api/item-types/${itemType}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.status === 404);

    let maxQuantity = 100; // Default max quantity
    if (isNewType) {
        maxQuantity = prompt(`The item type "${itemType}" is new. Please set the max quantity:`, 100);
        if (!maxQuantity || isNaN(maxQuantity)) {
            alert('Invalid max quantity.');
            return;
        }
    }

    const response = await fetch('/api/inventory/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, quantity, price, receivePrice, sellPrice, addedDate, itemType, maxQuantity })
    });

    if (response.status === 201) {
        alert('Item created successfully!');
        fetchItems();
    } else {
        const error = await response.json();
        alert(error.message);
    }
}

document.getElementById('createItemForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    showLoading();

    const name = document.getElementById('name').value;
    const quantity = parseFloat(document.getElementById('quantity').value);
    const price = parseFloat(document.getElementById('price').value);
    const receivePrice = parseFloat(document.getElementById('receivePrice').value);
    const sellPrice = parseFloat(document.getElementById('sellPrice').value);
    const addedDate = document.getElementById('addedDate').value;
    const itemType = document.getElementById('itemType').value;

    const token = getToken();
    if (!token) {
        alert('You are not authorized. Please log in.');
        window.location.href = 'login.html';
        return;
    }

    // Fetch the current quantity for the item type
    const response = await fetch(`/api/inventory/quantity?name=${name}&itemType=${itemType}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await response.json();
    const existingQuantity = data.quantity || 0;
    const maxQuantity = data.maxQuantity || 100;

    if (existingQuantity + quantity > maxQuantity) {
        alert(`Total quantity (${existingQuantity + quantity}) exceeds the max limit (${maxQuantity}) for item type "${itemType}".`);
        hideLoading();
        return;
    }

    // Proceed with creating the item
    const createResponse = await fetch('/api/inventory/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, quantity, price, receivePrice, sellPrice, addedDate, itemType })
    });

    hideLoading();
    if (createResponse.ok) {
        alert('Item created successfully');
        $('#createItemModal').modal('hide');
        fetchItems();
    } else {
        const error = await createResponse.json();
        alert(error.message);
    }
});

document.getElementById('updateMaxQuantityForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    showLoading();

    const itemType = document.getElementById('itemType').value;
    const maxQuantity = parseInt(document.getElementById('maxQuantity').value);

    const token = getToken();
    if (!token) {
        alert('You are not authorized. Please log in.');
        window.location.href = 'login.html';
        return;
    }

    const response = await fetch('/api/inventory/update-max-quantity', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ itemType, maxQuantity })
    });

    hideLoading();
    if (response.ok) {
        alert('Max quantity updated successfully');
        $('#updateMaxQuantityModal').modal('hide');
    } else {
        const error = await response.json();
        alert(error.message);
    }
});

