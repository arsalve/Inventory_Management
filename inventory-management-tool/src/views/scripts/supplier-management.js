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
 * Fetch all suppliers and populate the table.
 */
async function fetchSuppliers() {
    showLoading();
    const response = await fetch('/api/suppliers', {
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    });
    const suppliers = await response.json();
    const tableBody = document.getElementById('supplierTable').querySelector('tbody');
    tableBody.innerHTML = '';

    suppliers.forEach(supplier => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${supplier.name}</td>
            <td>${supplier.email}</td>
            <td>${supplier.phone}</td>
            <td>${supplier.address}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="deleteSupplier('${supplier._id}')">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    hideLoading();
}

/**
 * Handle the form submission for creating a supplier.
 * @param {Event} e - The form submission event.
 */
document.getElementById('createSupplierForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    showLoading();
    const name = document.getElementById('supplierName').value;
    const email = document.getElementById('supplierEmail').value;
    const phone = document.getElementById('supplierPhone').value;
    const address = document.getElementById('supplierAddress').value;

    const response = await fetch('/api/suppliers/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ name, email, phone, address })
    });

    hideLoading();
    if (response.ok) {
        alert('Supplier added successfully');
        $('#createSupplierModal').modal('hide');
        fetchSuppliers();
        fetchSuppliersForDropdown(); // Update the supplier dropdown in the inventory page
    } else {
        alert('Failed to add supplier');
    }
});

/**
 * Fetch all suppliers and populate the supplier dropdown in the inventory page.
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
    if (supplierSelect) {
        supplierSelect.innerHTML = '<option value="" disabled selected>Select Supplier</option>';
        suppliers.forEach(supplier => {
            const option = document.createElement('option');
            option.value = supplier._id;
            option.textContent = supplier.name;
            supplierSelect.appendChild(option);
        });
    }
}

/**
 * Delete a supplier by ID.
 * @param {string} id - The supplier ID.
 */
async function deleteSupplier(id) {
    if (!confirm('Are you sure you want to delete this supplier?')) return;

    showLoading();
    const response = await fetch(`/api/suppliers/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    });

    hideLoading();
    if (response.ok) {
        alert('Supplier deleted successfully');
        fetchSuppliers();
    } else {
        alert('Failed to delete supplier');
    }
}

// Fetch suppliers when the page loads
fetchSuppliers();
