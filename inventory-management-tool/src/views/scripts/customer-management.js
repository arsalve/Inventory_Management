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
    const response = await fetch('/api/customers', {
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    });
    const customers = await response.json();
    const tableBody = document.getElementById('customerTable').querySelector('tbody');
    tableBody.innerHTML = '';

    customers.forEach(customer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${customer.name}</td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
        `;
        tableBody.appendChild(row);
    });

    hideLoading();
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

    const response = await fetch('/api/customers/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ name, email, phone })
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

// Fetch customers when the page loads
fetchCustomers();