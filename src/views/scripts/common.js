function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

function showLoading() {
    $('#loadingModal').modal('show');
}

function hideLoading() {
    $('#loadingModal').modal('hide');
}

function getToken() {
    return localStorage.getItem('token');
}

function getUserRole() {
    const token = getToken();
    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role;
    }
    return null;
}

function displayUserRole() {
    const role = getUserRole();
    const userRoleBox = document.getElementById('userRoleBox');
    if (role) {
        userRoleBox.textContent = role.charAt(0).toUpperCase() + role.slice(1) + ' User';
    }
}
