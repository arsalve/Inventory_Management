/**
 * Handle the form submission for logging in a user.
 * @param {Event} e - The form submission event.
 */
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);

            if (data.role === 'admin') {
                window.location.href = '/admin-dashboard';
            } else if (data.role === 'staff') {
                window.location.href = '/dashboard';
            } else if (data.role === 'customer') {
                window.location.href = '/dashboard';
            }
        } else {
            const error = await response.json();
            alert(`Login failed: ${error.message}`);
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred during login.');
    }
});