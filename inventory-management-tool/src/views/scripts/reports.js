async function fetchReportsData() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('You are not authorized. Please log in.');
        window.location.href = 'login.html';
        return;
    }

    const response = await fetch('/api/reports', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (response.status === 401) {
        alert('You are not authorized. Please log in.');
        window.location.href = 'login.html';
        return;
    }

    const data = await response.json();
    console.log('API Response:', data); // Debugging: Log the API response

    // Populate summary cards
    document.getElementById('totalUsedItems').textContent = data.totalUsedItems;
    document.getElementById('currentAvailableItems').textContent = data.currentAvailableItems;
    document.getElementById('totalSaleAmount').textContent = `₹${data.totalSaleAmount.toFixed(2)}`;

    // Check if totalPurchaseAmount exists and populate it
    if (data.totalPurchaseAmount !== undefined) {
        document.getElementById('totalPurchaseAmount').textContent = `₹${data.totalPurchaseAmount.toFixed(2)}`;
    } else {
        console.error('totalPurchaseAmount is missing in the API response.');
        document.getElementById('totalPurchaseAmount').textContent = 'N/A';
    }

    // Add event listeners to the cards
    document.getElementById('totalUsedItemsCard').addEventListener('click', () => showUsedItems(data.usedItems));
    document.getElementById('currentAvailableItemsCard').addEventListener('click', () => showAvailableItems(data.availableItems));

    // Calculate insights based on fetched data
    calculateInsights(data);
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}
function showUsedItems(usedItems) {
    console.log('Used Items:', usedItems); // Debugging log
    const tableBody = document.getElementById('usedItemsTableBody');
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

    $('#usedItemsModal').modal('show');
}

function showAvailableItems(availableItems) {
    console.log('Available Items:', availableItems); // Debugging log
    const tableBody = document.getElementById('availableItemsTableBody');
    tableBody.innerHTML = '';

    availableItems.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.price}</td>
            <td>${item.receivePrice}</td>
            <td>${item.sellPrice}</td>
            <td>${new Date(item.addedDate).toLocaleDateString()}</td>
            <td>${item.itemType}</td>
        `;
        tableBody.appendChild(row);
    });

    $('#availableItemsModal').modal('show');
}

function calculateInsights(data) {
    const usedItems = data.usedItems;
    const availableItems = data.availableItems;

    let totalUsedItems = 0;
    let currentAvailableItems = 0;
    let totalSaleAmount = data.totalSaleAmount;
    let totalPurchaseAmount = 0;

    const usedItemsData = {};
    const availableItemsData = {};

    usedItems.forEach(item => {
        totalUsedItems += item.quantityUsed;

        if (!usedItemsData[item.usedBy]) {
            usedItemsData[item.usedBy] = 0;
        }
        usedItemsData[item.usedBy] += item.quantityUsed;
    });

    availableItems.forEach(item => {
        currentAvailableItems += item.quantity;
        totalPurchaseAmount += item.quantity * parseFloat(item.receivePrice);

        if (!availableItemsData[item.itemType]) {
            availableItemsData[item.itemType] = 0;
        }
        availableItemsData[item.itemType] += item.quantity;
    });

    const usagePatterns = `Total used items: ${totalUsedItems}`;
    const availableItemsInsights = `Current available items: ${currentAvailableItems}`;
    const salePurchaseInsights = `Total sale amount: ₹${totalSaleAmount.toFixed(2)}, Total purchase amount: ₹${totalPurchaseAmount.toFixed(2)}`;
    const profitLossInsights = `Profit/Loss: ₹${(totalSaleAmount - totalPurchaseAmount).toFixed(2)}`;
    const idleItemsInsights = `Idle items: ${currentAvailableItems - totalUsedItems}`;

    

    // Generate treemap charts
    const usedItemsTreemapData = {
        type: "treemap",
        labels: Object.keys(usedItemsData),
        parents: Object.keys(usedItemsData).map(() => "Used Items"),
        values: Object.values(usedItemsData),
        textinfo: "label+value+percent parent+percent entry"
    };

    const availableItemsTreemapData = {
        type: "treemap",
        labels: Object.keys(availableItemsData),
        parents: Object.keys(availableItemsData).map(() => "Available Items"),
        values: Object.values(availableItemsData),
        textinfo: "label+value+percent parent+percent entry"
    };

    Plotly.newPlot('currentStockTreeChart', [availableItemsTreemapData]);
    Plotly.newPlot('usedStockTreeChart', [usedItemsTreemapData]);
}

// Function to wait for an element to be available in the DOM
function waitForElement(selector, callback) {
    const element = document.querySelector(selector);
    if (element) {
        callback(element);
    } else {
        setTimeout(() => waitForElement(selector, callback), 100); // Retry after 100ms
    }
}

// Function to fetch reports
async function fetchReports() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('You are not authorized. Please log in.');
        window.location.href = 'login.html';
        return;
    }

    const fetchAllCheckbox = document.getElementById('fetchAllCheckbox');
    const fetchAll = fetchAllCheckbox.checked;
    let startDate = document.getElementById('startDate').value;
    let endDate = document.getElementById('endDate').value;

    if (!fetchAll && (!startDate || !endDate)) {
        alert('Please select both start and end dates or check "Fetch All Data".');
        return;
    }

    try {
        let url = '/api/reports';
        if (!fetchAll) {
            url += `?startDate=${startDate}&endDate=${endDate}`;
        }

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const error = await response.json();
            alert(error.message || 'Failed to fetch reports.');
            return;
        }

        const data = await response.json();

        // Populate summary cards
        document.getElementById('totalUsedItems').textContent = data.totalUsedItems;
        document.getElementById('currentAvailableItems').textContent = data.currentAvailableItems;
        document.getElementById('totalSaleAmount').textContent = `₹${data.totalSaleAmount.toFixed(2)}`;
    // Check if totalPurchaseAmount exists and populate it
    if (data.totalPurchaseAmount !== undefined) {
        document.getElementById('totalPurchaseAmount').textContent = `₹${data.totalPurchaseAmount.toFixed(2)}`;
    } else {
        console.error('totalPurchaseAmount is missing in the API response.');
        document.getElementById('totalPurchaseAmount').textContent = 'N/A';
    }

        // Populate tables and insights
       // showUsedItems(data.usedItems);
       // showAvailableItems(data.availableItems);
        calculateInsights(data);
    } catch (error) {
        console.error('Error fetching reports:', error);
        alert('An error occurred while fetching reports.');
    }
}

function updateCardStyles() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.style.color = '#ffffff'; // Set text color to white
        card.style.backgroundColor = '#343a40'; // Dark background for better contrast
    });
}

// Wait for the window to load before adding event listeners
window.onload = () => {
    const fetchReportsButton = document.getElementById('fetchReportsButton');
    const fetchAllCheckbox = document.getElementById('fetchAllCheckbox');
    const totalPurchaseAmountElement = document.getElementById('totalPurchaseAmount'); // Select the element by ID

    if (fetchReportsButton) {
        fetchReportsButton.addEventListener('click', () => {
            fetchReports();
            updateCardStyles(); // Update card styles after fetching reports
        });
    } else {
        console.error('fetchReportsButton element not found in the DOM.');
    }

    if (fetchAllCheckbox) {
        fetchAllCheckbox.addEventListener('change', () => {
            if (fetchAllCheckbox.checked) {
                totalPurchaseAmountElement.parentElement.parentElement.style.display = 'block'; // Show the card
            } else {
                totalPurchaseAmountElement.parentElement.parentElement.style.display = 'none'; // Hide the card
            }
        });

        // Initialize the visibility based on the checkbox state
        if (fetchAllCheckbox.checked) {
            totalPurchaseAmountElement.parentElement.parentElement.style.display = 'block';
        } else {
            totalPurchaseAmountElement.parentElement.parentElement.style.display = 'none';
        }
    } else {
        console.error('fetchAllCheckbox element not found in the DOM.');
    }
};
document.addEventListener('DOMContentLoaded', () => {
    const currentAvailableItemsCard = document.getElementById('currentAvailableItemsCard');
    const availableItemsModal = new bootstrap.Modal(document.getElementById('availableItemsModal'));

    if (currentAvailableItemsCard) {
        currentAvailableItemsCard.addEventListener('click', () => {
            // Show the Available Items Modal
            availableItemsModal.show();
        });
    } else {
        console.error('currentAvailableItemsCard element not found in the DOM.');
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const currentAvailableItemsCard = document.getElementById('totalUsedItemsCard');
    const availableItemsModal = new bootstrap.Modal(document.getElementById('usedItemsModal'));

    if (currentAvailableItemsCard) {
        currentAvailableItemsCard.addEventListener('click', () => {
            // Show the Available Items Modal
            availableItemsModal.show();
        });
    } else {
        console.error('currentAvailableItemsCard element not found in the DOM.');
    }
});