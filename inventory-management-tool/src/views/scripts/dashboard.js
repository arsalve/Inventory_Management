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
    if (role) {
        userRoleBox.textContent = role.charAt(0).toUpperCase() + role.slice(1) + ' User';
    }
}

// Call displayUserRole when the page loads
displayUserRole();

/**
 * Handle the form submission for creating an item.
 * @param {Event} e - The form submission event.
 */
document.getElementById('createItemForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    showLoading();
    const name = document.getElementById('name').value;
    const quantity = parseFloat(document.getElementById('quantity').value);
    const price = parseFloat(document.getElementById('price').value);
    const receivePrice = parseFloat(document.getElementById('receivePrice').value);
    const sellPrice = parseFloat(document.getElementById('sellPrice').value);
    const expiryDate = document.getElementById('expiryDate').value;
    const itemType = document.getElementById('itemType').value;

    const response = await fetch('/api/inventory/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ name, quantity, price, receivePrice, sellPrice, expiryDate, itemType })
    });

    hideLoading();
    if (response.ok) {
        alert('Item created successfully');
        $('#createItemModal').modal('hide');
        fetchItems();
    } else {
        alert('Failed to create item');
    }
});

/**
 * Handle the form submission for using an item.
 * @param {Event} e - The form submission event.
 */
document.getElementById('useItemForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    showLoading();
    const itemId = document.getElementById('useItemId').value;
    const quantityUsed = parseFloat(document.getElementById('quantityUsed').value);
    const usedBy = document.getElementById('usedBy').value;
    const reason = document.getElementById('reason').value;
    const customerId = document.getElementById('customerSelect').value;

    const response = await fetch(`/api/inventory/use/${itemId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ quantityUsed, usedBy, reason, customer: customerId })
    });

    hideLoading();
    if (response.ok) {
        alert('Item used successfully');
        $('#useItemModal').modal('hide');
        fetchItems();
    } else {
        alert('Failed to use item');
    }
});

/**
 * Handle the form submission for removing an item.
 * @param {Event} e - The form submission event.
 */
document.getElementById('removeItemForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    showLoading();
    const removeItemId = document.getElementById('removeItemId').value;
    const quantityRemoved = parseFloat(document.getElementById('quantityRemoved').value);

    const response = await fetch(`/api/inventory/remove/${removeItemId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ quantityRemoved })
    });

    hideLoading();
    if (response.ok) {
        alert('Item removed successfully');
        $('#removeItemModal').modal('hide');
        fetchItems();
    } else {
        alert('Failed to remove item');
    }
});

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
            <td>${new Date(item.expiryDate).toLocaleDateString()}</td>
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
    const response = await fetch('/api/customers', {
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    });
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

// Fetch items and customers when the page loads
fetchItems();
fetchCustomersForDropdown();