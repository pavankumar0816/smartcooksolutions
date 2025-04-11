document.addEventListener('DOMContentLoaded', function() {
    // Simulated user database, login state, and cart
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn')) || false;
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Product data (simulated)
    const products = {
        1: { id: 1, name: 'Smart Vessel', price: 999 },
        2: { id: 2, name: 'Smart Pan', price: 1499 }
    };

    // Save cart and login state to localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function saveLoginState() {
        localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }

    // Calculate total amount in cart
    function getCartTotal() {
        return cart.reduce((total, item) => total + item.price, 0);
    }

    // Modal handling
    const cartModal = document.getElementById('cart-modal');
    const paymentModal = document.getElementById('payment-modal');
    const buyBtns = document.querySelectorAll('.buy.btn');
    const addToCartBtns = document.querySelectorAll('.add-to-cart.btn');
    const paymentForm = document.getElementById('payment-form');
    const proceedToPaymentBtn = document.getElementById('proceed-to-payment');
    const closeBtns = document.querySelectorAll('.close');
    const loginLink = document.getElementById('login-link');
    const logoutLink = document.getElementById('logout-link');
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
    const cardFields = document.getElementById('card-fields');
    const upiFields = document.getElementById('upi-fields');
    const netbankingFields = document.getElementById('netbanking-fields');

    // Debug: Log the number of buttons found
    console.log('Buy buttons found:', buyBtns.length);
    console.log('Add to Cart buttons found:', addToCartBtns.length);

    // Initialize login/logout visibility
    if (isLoggedIn) {
        loginLink.style.display = 'none';
        logoutLink.style.display = 'inline';
    } else {
        loginLink.style.display = 'inline';
        logoutLink.style.display = 'none';
    }

    // Show login prompt from header (redirect to index.html)
    loginLink.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'index.html#login';
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

    // Handle "Buy Now" buttons
    buyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            console.log('Buy Now button clicked');
            if (isLoggedIn) {
                const productId = this.parentElement.getAttribute('data-product-id');
                const product = products[productId];
                cart = [product]; // Reset cart to only this product
                saveCart();
                updateCartModal();
                paymentModal.style.display = 'block';
            } else {
                const proceed = confirm('You need to be logged in to proceed with your purchase. Would you like to login now?');
                if (proceed) {
                    window.location.href = 'index.html#login';
                }
            }
        });
    });

    // Handle "Add to Cart" buttons
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            console.log('Add to Cart button clicked');
            const productId = this.parentElement.getAttribute('data-product-id');
            const product = products[productId];
            cart.push(product);
            saveCart();
            updateCartModal();
            cartModal.style.display = 'block';
        });
    });

    // Update cart modal content
    function updateCartModal() {
        const cartItemsDiv = document.getElementById('cart-items');
        cartItemsDiv.innerHTML = '';
        if (cart.length === 0) {
            cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
        } else {
            cart.forEach((item, index) => {
                cartItemsDiv.innerHTML += `<p>${item.name} - ₹${item.price} <button onclick="removeFromCart(${index})">Remove</button></p>`;
            });
            cartItemsDiv.innerHTML += `<p><strong>Total: ₹${getCartTotal()}</strong></p>`;
        }
    }

    // Remove item from cart
    window.removeFromCart = function(index) {
        cart.splice(index, 1);
        saveCart();
        updateCartModal();
    };

    // Proceed to payment from cart
    proceedToPaymentBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Your cart is empty. Add items to proceed.');
        } else if (isLoggedIn) {
            cartModal.style.display = 'none';
            paymentModal.style.display = 'block';
        } else {
            const proceed = confirm('You need to be logged in to proceed with payment. Would you like to login now?');
            if (proceed) {
                window.location.href = 'index.html#login';
            }
        }
    });

    // Close modals when clicking the "x"
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            cartModal.style.display = 'none';
            paymentModal.style.display = 'none';
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === cartModal) cartModal.style.display = 'none';
        if (e.target === paymentModal) paymentModal.style.display = 'none';
    });

    // Toggle payment fields based on selected method
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            cardFields.style.display = this.value === 'card' ? 'block' : 'none';
            upiFields.style.display = this.value === 'upi' ? 'block' : 'none';
            netbankingFields.style.display = this.value === 'netbanking' ? 'block' : 'none';
        });
    });

    // Handle payment form submission (simulated payment gateway)
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (!isLoggedIn) {
            alert('Error: You must be logged in to complete payment.');
            paymentModal.style.display = 'none';
            window.location.href = 'index.html#login';
            return;
        }

        const selectedMethod = document.querySelector('input[name="payment-method"]:checked').value;
        let paymentDetails = '';
        let isValid = true;

        switch (selectedMethod) {
            case 'card':
                const cardNumber = document.getElementById('card-number').value;
                const expiry = document.getElementById('expiry').value;
                const cvv = document.getElementById('cvv').value;
                if (cardNumber.length < 16 || expiry.length < 5 || cvv.length < 3) {
                    alert('Please enter valid card details.');
                    isValid = false;
                } else {
                    paymentDetails = `Card ending in ${cardNumber.slice(-4)}`;
                }
                break;
            case 'upi':
                const upiId = document.getElementById('upi-id').value;
                if (!upiId.includes('@')) {
                    alert('Please enter a valid UPI ID.');
                    isValid = false;
                } else {
                    paymentDetails = `UPI ID: ${upiId}`;
                }
                break;
            case 'netbanking':
                const bank = document.getElementById('bank-select').value;
                if (!bank) {
                    alert('Please select a bank.');
                    isValid = false;
                } else {
                    paymentDetails = `Bank: ${bank.toUpperCase()}`;
                }
                break;
        }

        if (isValid) {
            const total = getCartTotal();
            alert(`Payment of ₹${total} successful via ${selectedMethod.toUpperCase()} (${paymentDetails})! Thank you for your purchase.`);
            paymentModal.style.display = 'none';
            cart = [];
            saveCart();
            updateCartModal();
            paymentForm.reset();
            cardFields.style.display = 'block'; // Reset to card view
            upiFields.style.display = 'none';
            netbankingFields.style.display = 'none';
        }
    });

    // Initial cart update
    updateCartModal();
});