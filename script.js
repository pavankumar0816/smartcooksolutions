// Simulated user database and login state
let users = JSON.parse(localStorage.getItem('users')) || [];
let isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn')) || false;
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Save login state to localStorage
function saveLoginState() {
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

// Smooth scrolling for navigation links
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const sectionId = this.getAttribute('href');
        document.querySelector(sectionId).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Modal handling
const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('register-modal');
const forgotPasswordModal = document.getElementById('forgot-password-modal');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const forgotPasswordForm = document.getElementById('forgot-password-form');
const closeBtns = document.querySelectorAll('.close');
const contactForm = document.getElementById('contact-form');
const registerLink = document.getElementById('register-link');
const forgotPasswordLink = document.getElementById('forgot-password-link');
const loginLink = document.getElementById('login-link');
const logoutLink = document.getElementById('logout-link');

// Initialize login/logout visibility
if (isLoggedIn) {
    loginLink.style.display = 'none';
    logoutLink.style.display = 'inline';
} else {
    loginLink.style.display = 'inline';
    logoutLink.style.display = 'none';
}

// Show login modal from header
loginLink.addEventListener('click', function(e) {
    e.preventDefault();
    loginModal.style.display = 'block';
});

// Handle logout
logoutLink.addEventListener('click', function(e) {
    e.preventDefault();
    isLoggedIn = false;
    currentUser = null;
    loginLink.style.display = 'inline';
    logoutLink.style.display = 'none';
    saveLoginState();
    alert('Logged out successfully!');
});

// Show register modal
registerLink.addEventListener('click', function(e) {
    e.preventDefault();
    loginModal.style.display = 'none';
    registerModal.style.display = 'block';
});

// Show forgot password modal
forgotPasswordLink.addEventListener('click', function(e) {
    e.preventDefault();
    loginModal.style.display = 'none';
    forgotPasswordModal.style.display = 'block';
});

// Close modals when clicking the "x"
closeBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        loginModal.style.display = 'none';
        registerModal.style.display = 'none';
        forgotPasswordModal.style.display = 'none';
    });
});

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    if (e.target === loginModal) loginModal.style.display = 'none';
    if (e.target === registerModal) registerModal.style.display = 'none';
    if (e.target === forgotPasswordModal) forgotPasswordModal.style.display = 'none';
});

// Handle login form submission
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        isLoggedIn = true;
        currentUser = user;
        loginLink.style.display = 'none';
        logoutLink.style.display = 'inline';
        saveLoginState();
        alert('Login successful!');
        loginModal.style.display = 'none';
    } else {
        alert('Invalid email or password. Please register if you don\'t have an account.');
    }
});

// Handle register form submission
registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    if (users.some(u => u.email === email)) {
        alert('Email already exists. Please use a different email or login.');
    } else {
        users.push({ email, password });
        saveLoginState();
        alert('Registration successful! Please login.');
        registerModal.style.display = 'none';
        loginModal.style.display = 'block';
    }
});

// Handle forgot password form submission
forgotPasswordForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('forgot-email').value;

    const user = users.find(u => u.email === email);
    if (user) {
        const newPassword = prompt('Enter your new password:');
        if (newPassword) {
            user.password = newPassword;
            saveLoginState();
            alert('Password reset successful! Please login with your new password.');
            forgotPasswordModal.style.display = 'none';
            loginModal.style.display = 'block';
        }
    } else {
        alert('Email not found. Please register first.');
    }
});

// Handle contact form submission (simulated)
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    if (name && email && message) {
        alert(`Thank you, ${name}! Your message has been sent. We'll get back to you at ${email}.`);
        contactForm.reset();
    } else {
        alert('Please fill out all fields.');
    }
});