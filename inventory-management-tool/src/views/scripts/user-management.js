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
 * Prompt for password and re-authenticate the user.
 */
async function promptForPassword() {
    const password = prompt('Please enter your password:');
    if (!password) {
        alert('Password is required');
        return null;
    }

    const username = localStorage.getItem('username');
    if (!username) {
        alert('Username is not found in local storage');
        return null;
    }

    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        return data.token;
    } else {
        alert('Failed to re-authenticate');
        return null;
    }
}

/**
 * Ensure the token is available, prompt for password if not.
 */
async function ensureToken() {
    let token = getToken();
    if (!token) {
        token = await promptForPassword();
    }
    return token;
}

/**
 * Fetch all users and populate the table.
 */
async function fetchUsers() {
    showLoading();
    const token = await ensureToken();
    if (!token) {
        hideLoading();
        return;
    }

    const response = await fetch('/api/auth/users', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (response.ok) {
        const users = await response.json();
        const tableBody = document.getElementById('userTable').querySelector('tbody');
        tableBody.innerHTML = '';

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
            `;
            tableBody.appendChild(row);
        });
    } else {
        alert('Failed to fetch users');
    }

    hideLoading();
}

/**
 * Handle the form submission for creating a user.
 * @param {Event} e - The form submission event.
 */
document.getElementById('createUserForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    showLoading();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    const token = await ensureToken();
    if (!token) {
        hideLoading();
        return;
    }

    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username, email, password, role })
    });

    hideLoading();
    if (response.ok) {
        alert('User added successfully');
        $('#createUserModal').modal('hide');
        fetchUsers();
    } else {
        alert('Failed to add user');
    }
});

// Fetch users when the page loads
fetchUsers();