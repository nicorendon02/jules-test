// Fake Database of Cookie Stock
// We want cookies to drop below 10 units in a staggered way:
// 1st: 10s, 2nd: 20s, 3rd: 30s, etc.
const cookieInventory = [
    { type: 'Chocolate Chip', stock: 120, max: 200, color: 'primary', targetTime: 10 },
    { type: 'Oatmeal Raisin', stock: 85, max: 150, color: 'warning', targetTime: 20 },
    { type: 'Sugar Cookie', stock: 90, max: 180, color: 'info', targetTime: 30 },
    { type: 'Double Chocolate', stock: 45, max: 100, color: 'danger', targetTime: 40 },
    { type: 'Snickerdoodle', stock: 90, max: 120, color: 'success', targetTime: 500 } // This one stays longer
];

// Initialize depletion rates
cookieInventory.forEach(cookie => {
    // We want to reach < 10 (say, 5) by targetTime.
    // Rate = (Start - End) / Time
    // We use a separate property for precise tracking
    cookie.currentStock = cookie.stock;
    const targetStock = 5;
    if (cookie.stock > targetStock) {
        cookie.depletionRate = (cookie.stock - targetStock) / cookie.targetTime;
    } else {
        cookie.depletionRate = 0;
    }
});

// Function to render the stock widget
function renderStock() {
    const stockContainer = document.getElementById('cookie-stock-list');
    if (!stockContainer) return;

    stockContainer.innerHTML = ''; // Clear existing content

    cookieInventory.forEach(cookie => {
        // Display floor value
        const displayStock = Math.ceil(cookie.currentStock);
        const percentage = Math.round((displayStock / cookie.max) * 100);

        let progressBarColor = cookie.color;
        let textColorClass = '';

        if (displayStock < 10) {
            progressBarColor = 'danger';
            textColorClass = 'text-danger font-weight-bold';
        }

        const itemHtml = `
            <h4 class="small font-weight-bold">
                ${cookie.type} 
                <span class="float-right ${textColorClass}">
                    ${displayStock} units
                </span>
            </h4>
            <div class="progress mb-4">
                <div class="progress-bar bg-${progressBarColor}" role="progressbar" style="width: ${percentage}%"
                    aria-valuenow="${percentage}" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
        `;
        stockContainer.innerHTML += itemHtml;
    });
}

// Function to simulate sales
function updateStock() {
    cookieInventory.forEach(cookie => {
        // Decrease precise stock
        if (cookie.currentStock > 0) {
            cookie.currentStock -= cookie.depletionRate;
        }
        // Ensure we don't go below 0
        if (cookie.currentStock < 0) cookie.currentStock = 0;

        // Update the display stock property for compatibility if needed, 
        // but renderStock uses currentStock directly.
        cookie.stock = Math.ceil(cookie.currentStock);
    });
    renderStock();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderStock();
    // Update every 1 second
    setInterval(updateStock, 1000);
});
