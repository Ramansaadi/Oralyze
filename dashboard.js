// Dashboard Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('orayze_current_user'));
    
    if (!currentUser) {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
        return;
    }

    // Display user information
    displayUserInfo(currentUser);
    
    // Initialize dashboard functionality
    initDashboard();
});

function displayUserInfo(user) {
    const userNameElement = document.getElementById('userName');
    if (userNameElement && user.firstName) {
        userNameElement.textContent = user.firstName;
    }
}

function initDashboard() {
    // Add event listeners for dashboard interactions
    addScanButtonListener();
    addActionButtonListeners();
    addNavigationListeners();
}

function addScanButtonListener() {
    const scanButton = document.querySelector('.scan-button');
    if (scanButton) {
        scanButton.addEventListener('click', function() {
            // Simulate scan functionality
            showScanModal();
        });
    }
}

function addActionButtonListeners() {
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.textContent.toLowerCase();
            handleAction(action);
        });
    });
}

function addNavigationListeners() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Handle navigation (for now, just show a message)
            const section = this.textContent.toLowerCase();
            showSectionMessage(section);
        });
    });
}

function handleAction(action) {
    switch(action) {
        case 'start scan':
            showScanModal();
            break;
        case 'view history':
            showHistoryMessage();
            break;
        case 'settings':
            showSettingsMessage();
            break;
        default:
            console.log('Action:', action);
    }
}

function showScanModal() {
    // Create modal for scan functionality
    const modal = document.createElement('div');
    modal.className = 'scan-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Start New Scan</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="scan-instructions">
                    <h4>How to take a good scan:</h4>
                    <ol>
                        <li>Ensure good lighting</li>
                        <li>Open your mouth wide</li>
                        <li>Hold your phone steady</li>
                        <li>Take a clear photo of your teeth</li>
                    </ol>
                </div>
                <div class="scan-options">
                    <button class="camera-btn">📷 Use Camera</button>
                    <button class="upload-btn">📁 Upload Photo</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    const closeBtn = modal.querySelector('.close-modal');
    const cameraBtn = modal.querySelector('.camera-btn');
    const uploadBtn = modal.querySelector('.upload-btn');
    
    closeBtn.addEventListener('click', () => modal.remove());
    cameraBtn.addEventListener('click', () => simulateScan('camera'));
    uploadBtn.addEventListener('click', () => simulateScan('upload'));
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

function simulateScan(type) {
    const modal = document.querySelector('.scan-modal');
    const modalBody = modal.querySelector('.modal-body');
    
    modalBody.innerHTML = `
        <div class="scanning-animation">
            <div class="scan-circle"></div>
            <p>Scanning your oral health...</p>
        </div>
    `;
    
    // Simulate scan process
    setTimeout(() => {
        modalBody.innerHTML = `
            <div class="scan-complete">
                <div class="success-icon">✓</div>
                <h4>Scan Complete!</h4>
                <p>Your oral health analysis is ready.</p>
                <button class="view-results-btn">View Results</button>
            </div>
        `;
        
        const viewResultsBtn = modal.querySelector('.view-results-btn');
        viewResultsBtn.addEventListener('click', () => {
            modal.remove();
            showScanResults();
        });
    }, 3000);
}

function showScanResults() {
    // Update dashboard stats
    updateStats();
    
    // Show success message
    showMessage('Scan completed successfully! Your health score has been updated.', 'success');
}

function updateStats() {
    const totalScansElement = document.querySelector('.stat-card:nth-child(1) .stat-number');
    const healthScoreElement = document.querySelector('.stat-card:nth-child(2) .stat-number');
    const lastScanElement = document.querySelector('.stat-card:nth-child(3) .stat-number');
    
    if (totalScansElement) {
        const currentScans = parseInt(totalScansElement.textContent) || 0;
        totalScansElement.textContent = currentScans + 1;
    }
    
    if (healthScoreElement) {
        const score = Math.floor(Math.random() * 30) + 70; // Random score between 70-100
        healthScoreElement.textContent = score;
    }
    
    if (lastScanElement) {
        lastScanElement.textContent = 'Today';
    }
}

function showHistoryMessage() {
    showMessage('Scan history feature coming soon!', 'info');
}

function showSettingsMessage() {
    showMessage('Settings page coming soon!', 'info');
}

function showSectionMessage(section) {
    const messages = {
        'dashboard': 'You are on the main dashboard.',
        'my scans': 'View your scan history and results.',
        'health insights': 'Detailed health analytics and trends.',
        'profile': 'Manage your account settings and preferences.'
    };
    
    showMessage(messages[section] || 'Section coming soon!', 'info');
}

function showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.dashboard-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `dashboard-message ${type}`;
    messageDiv.textContent = message;
    
    // Add styles
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    // Set background color based on type
    switch(type) {
        case 'success':
            messageDiv.style.background = '#20B2AA';
            break;
        case 'error':
            messageDiv.style.background = '#dc3545';
            break;
        case 'info':
            messageDiv.style.background = '#6c757d';
            break;
        default:
            messageDiv.style.background = '#20B2AA';
    }
    
    document.body.appendChild(messageDiv);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => messageDiv.remove(), 300);
        }
    }, 3000);
}

// Add CSS animations for messages
const messageStyles = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .scan-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }
    
    .modal-content {
        background: white;
        border-radius: 15px;
        padding: 30px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }
    
    .modal-header h3 {
        margin: 0;
        color: #333;
    }
    
    .close-modal {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #666;
    }
    
    .scan-instructions {
        margin-bottom: 25px;
    }
    
    .scan-instructions h4 {
        color: #333;
        margin-bottom: 15px;
    }
    
    .scan-instructions ol {
        color: #666;
        line-height: 1.6;
    }
    
    .scan-options {
        display: flex;
        gap: 15px;
        justify-content: center;
    }
    
    .camera-btn, .upload-btn {
        padding: 12px 20px;
        border: 2px solid #20B2AA;
        border-radius: 25px;
        background: white;
        color: #20B2AA;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .camera-btn:hover, .upload-btn:hover {
        background: #20B2AA;
        color: white;
    }
    
    .scanning-animation {
        text-align: center;
        padding: 40px 0;
    }
    
    .scan-circle {
        width: 80px;
        height: 80px;
        border: 4px solid #f0f0f0;
        border-top: 4px solid #20B2AA;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 20px;
    }
    
    .scan-complete {
        text-align: center;
        padding: 40px 0;
    }
    
    .success-icon {
        width: 60px;
        height: 60px;
        background: #20B2AA;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        margin: 0 auto 20px;
    }
    
    .view-results-btn {
        background: #20B2AA;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 25px;
        cursor: pointer;
        margin-top: 15px;
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = messageStyles;
document.head.appendChild(styleSheet); 