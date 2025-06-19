// User Authentication System
class AuthSystem {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('orayze_users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('orayze_current_user')) || null;
        this.init();
    }

    init() {
        // Check if user is already logged in
        if (this.currentUser && window.location.pathname.includes('index.html')) {
            this.redirectToDashboard();
        }

        // Initialize forms
        this.initLoginForm();
        this.initSignupForm();
        this.initLogout();
    }

    initLoginForm() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
    }

    initSignupForm() {
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }
    }

    initLogout() {
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => this.handleLogout(e));
        }
    }

    handleLogin(e) {
        e.preventDefault();
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;
        const remember = form.remember?.checked;

        // Show loading state
        const button = form.querySelector('.auth-button');
        button.classList.add('loading');
        button.textContent = 'Signing in...';

        // Simulate API call delay
        setTimeout(() => {
            const user = this.authenticateUser(email, password);
            
            if (user) {
                this.currentUser = user;
                localStorage.setItem('orayze_current_user', JSON.stringify(user));
                
                if (remember) {
                    localStorage.setItem('orayze_remember', 'true');
                }

                this.showMessage('Login successful! Redirecting...', 'success');
                setTimeout(() => {
                    this.redirectToDashboard();
                }, 1000);
            } else {
                this.showMessage('Invalid email or password. Please try again.', 'error');
                button.classList.remove('loading');
                button.textContent = 'Sign In';
            }
        }, 1000);
    }

    handleSignup(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        
        const userData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
            terms: formData.get('terms')
        };

        // Validation
        const validation = this.validateSignup(userData);
        if (!validation.isValid) {
            this.showMessage(validation.message, 'error');
            return;
        }

        // Show loading state
        const button = form.querySelector('.auth-button');
        button.classList.add('loading');
        button.textContent = 'Creating account...';

        // Simulate API call delay
        setTimeout(() => {
            const success = this.createUser(userData);
            
            if (success) {
                this.showMessage('Account created successfully! Please sign in.', 'success');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            } else {
                this.showMessage('Email already exists. Please use a different email.', 'error');
                button.classList.remove('loading');
                button.textContent = 'Create Account';
            }
        }, 1000);
    }

    validateSignup(userData) {
        if (!userData.firstName || !userData.lastName) {
            return { isValid: false, message: 'Please fill in all required fields.' };
        }

        if (!userData.email || !this.isValidEmail(userData.email)) {
            return { isValid: false, message: 'Please enter a valid email address.' };
        }

        if (!userData.password || userData.password.length < 8) {
            return { isValid: false, message: 'Password must be at least 8 characters long.' };
        }

        if (userData.password !== userData.confirmPassword) {
            return { isValid: false, message: 'Passwords do not match.' };
        }

        if (!userData.terms) {
            return { isValid: false, message: 'Please agree to the Terms of Service and Privacy Policy.' };
        }

        return { isValid: true };
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    authenticateUser(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        return user ? { ...user, password: undefined } : null;
    }

    createUser(userData) {
        // Check if email already exists
        if (this.users.find(u => u.email === userData.email)) {
            return false;
        }

        const newUser = {
            id: Date.now().toString(),
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            password: userData.password, // In a real app, this would be hashed
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        localStorage.setItem('orayze_users', JSON.stringify(this.users));
        return true;
    }

    handleLogout(e) {
        e.preventDefault();
        this.currentUser = null;
        localStorage.removeItem('orayze_current_user');
        localStorage.removeItem('orayze_remember');
        
        this.showMessage('Logged out successfully!', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }

    redirectToDashboard() {
        // For now, redirect to a dashboard page or show user info
        window.location.href = 'dashboard.html';
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;

        // Insert message before the form
        const form = document.querySelector('.auth-form');
        if (form) {
            form.parentNode.insertBefore(messageDiv, form);
        }

        // Auto-remove message after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

// Initialize authentication system
const auth = new AuthSystem();

// Add login/signup buttons to main page
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
        addAuthButtons();
    }
});

function addAuthButtons() {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent && !auth.isLoggedIn()) {
        const authButtons = document.createElement('div');
        authButtons.className = 'auth-buttons';
        authButtons.innerHTML = `
            <a href="login.html" class="auth-link login-link">Sign In</a>
            <a href="signup.html" class="auth-link signup-link">Sign Up</a>
        `;
        
        // Insert after the CTA button
        const ctaButton = heroContent.querySelector('.cta-button');
        if (ctaButton) {
            ctaButton.parentNode.insertBefore(authButtons, ctaButton.nextSibling);
        }
    }
}

// Add styles for auth buttons on main page
const authButtonStyles = `
    .auth-buttons {
        display: flex;
        gap: 15px;
        justify-content: center;
        margin-top: 20px;
    }
    
    .auth-link {
        padding: 12px 24px;
        border-radius: 25px;
        text-decoration: none;
        font-weight: 500;
        transition: all 0.3s ease;
    }
    
    .login-link {
        background: transparent;
        color: #20B2AA;
        border: 2px solid #20B2AA;
    }
    
    .login-link:hover {
        background: #20B2AA;
        color: white;
    }
    
    .signup-link {
        background: #20B2AA;
        color: white;
        border: 2px solid #20B2AA;
    }
    
    .signup-link:hover {
        background: #48D1CC;
        border-color: #48D1CC;
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = authButtonStyles;
document.head.appendChild(styleSheet); 