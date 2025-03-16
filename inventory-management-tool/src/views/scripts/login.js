/**
 * Handle the form submission for logging in a user.
 * @param {Event} e - The form submission event.
 */
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

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
        alert('Login successful');
        window.location.href = 'dashboard.html';
    } else {
        alert('Login failed');
    }
});