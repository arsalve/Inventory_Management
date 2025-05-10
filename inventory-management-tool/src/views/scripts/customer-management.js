// Function to get the token from local storage
function getToken() {
    return localStorage.getItem('token');
}

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

/**
 * Fetch all customers and populate the table.
 */
async function fetchCustomers() {
    showLoading();
    const token = getToken();
    if (!token) {
        alert('You are not authorized. Please log in.');
        window.location.href = 'login.html';
        return;
    }

    try {
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
        const tableBody = document.getElementById('customerTable').querySelector('tbody');
        tableBody.innerHTML = '';

        customers.forEach(customer => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${customer.name}</td>
                <td>${customer.email}</td>
                <td>${customer.phone}</td>
                <td>${customer.address}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteCustomer('${customer._id}')">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching customers:', error);
        alert('Failed to fetch customers. Please try again later.');
    } finally {
        hideLoading();
    }
}

/**
 * Handle the form submission for creating a customer.
 * @param {Event} e - The form submission event.
 */
document.getElementById('createCustomerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    showLoading();
    const name = document.getElementById('customerName').value;
    const email = document.getElementById('customerEmail').value;
    const phone = document.getElementById('customerPhone').value;
    const address = document.getElementById('customerAddress').value;

    const response = await fetch('/api/customers/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ name, email, phone, address })
    });

    hideLoading();
    if (response.ok) {
        alert('Customer added successfully');
        $('#createCustomerModal').modal('hide');
        fetchCustomers();
    } else {
        alert('Failed to add customer');
    }
});

/**
 * Delete a customer by ID.
 * @param {string} id - The customer ID.
 */
async function deleteCustomer(id) {
    if (!confirm('Are you sure you want to delete this customer?')) return;

    showLoading();
    const response = await fetch(`/api/customers/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    });

    hideLoading();
    if (response.ok) {
        alert('Customer deleted successfully');
        fetchCustomers();
    } else {
        alert('Failed to delete customer');
    }
}

// Fetch customers when the page loads
fetchCustomers();