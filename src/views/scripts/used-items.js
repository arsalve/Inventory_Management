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
 * Fetch all used inventory items and populate the table.
 */
async function fetchUsedItems() {
    showLoading();
    const response = await fetch('/api/inventory/used');
    const usedItems = await response.json();
    const tableBody = document.getElementById('usedItemsTable').querySelector('tbody');
    tableBody.innerHTML = '';

    usedItems.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantityUsed}</td>
            <td>${item.usedBy}</td>
            <td>${item.reason}</td>
            <td>${new Date(item.date).toLocaleDateString()}</td>
        `;
        tableBody.appendChild(row);
    });

    hideLoading();
}

// Fetch used items when the page loads
fetchUsedItems();