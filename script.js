// --- Cart Logic ---
let cart = JSON.parse(localStorage.getItem('cart')) || {};
const cartCountElement = document.getElementById('cart-count');
const addToCartButtons = document.querySelectorAll('.buy-btn');
const cartBtn = document.getElementById('cart-btn');
const cartMenu = document.getElementById('cart-menu');
const cartItemsDiv = document.getElementById('cart-items');
const cartTotalDiv = document.getElementById('cart-total');
const closeCartMenuBtn = document.getElementById('close-cart-menu');
const removeAllBtn = document.getElementById('remove-all-btn');

// Update and save cart
function updateCartCount() {
  const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
  if (cartCountElement) cartCountElement.textContent = totalItems;
}
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Rendering cart menu 
function renderCartMenu() {
  if (!cartItemsDiv || !cartTotalDiv) return;
  cartItemsDiv.innerHTML = '';
  if (Object.keys(cart).length === 0) {
    cartItemsDiv.innerHTML = '<em>Your cart is empty.</em>';
    cartTotalDiv.textContent = '';
    removeAllBtn.style.display = 'none';
    return;
  }
  removeAllBtn.style.display = 'block';
  let totalPrice = 0;
  Object.entries(cart).forEach(([name, data]) => {
    totalPrice += data.price * data.quantity;
    const row = document.createElement('div');
    row.className = 'cart-item-row';
    row.innerHTML = `
      <span>${name} x${data.quantity}</span>
      <span>
        $${(data.price * data.quantity).toFixed(2)}
        <button class="remove-item-btn" data-name="${name}">Remove</button>
      </span>
    `;
    cartItemsDiv.appendChild(row);
  });
  cartTotalDiv.textContent = `Total: $${totalPrice.toFixed(2)}`;
  // Remove button handlers
  document.querySelectorAll('.remove-item-btn').forEach(btn => {
    btn.onclick = function() {
      const itemName = btn.getAttribute('data-name');
      delete cart[itemName];
      saveCart();
      updateCartCount();
      renderCartMenu();
    };
  });
}

// Add to Cart handler
addToCartButtons.forEach(btn => {
  btn.addEventListener('click', function(e) {
    if (btn.tagName.toLowerCase() !== 'button') return;
    const card = btn.closest('.product-card');
    if (!card) return;
    const name = card.querySelector('h3').textContent.trim();
    const priceText = card.querySelector('p').textContent.trim();
    const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
    if (!cart[name]) {
      cart[name] = {quantity: 1, price};
    } else {
      cart[name].quantity += 1;
    }
    updateCartCount();
    saveCart();
  });
});

// Show cart menu
if (cartBtn && cartMenu) {
  cartBtn.addEventListener('click', function() {
    renderCartMenu();
    cartMenu.style.display = 'block';
  });
}

// Remove all items
if (removeAllBtn) {
  removeAllBtn.onclick = function() {
    cart = {};
    saveCart();
    updateCartCount();
    renderCartMenu();
  };
}

// Close cart menu
if (closeCartMenuBtn && cartMenu) {
  closeCartMenuBtn.addEventListener('click', function() {
    cartMenu.style.display = 'none';
  });
}

// On page load, set the cart count
updateCartCount();

// --- Product Search Bar ---
const productSearch = document.getElementById('product-search');
const searchBtn = document.getElementById('search-btn');
const productCards = document.querySelectorAll('.product-card');

function filterProducts() {
  const query = productSearch.value.toLowerCase();
  productCards.forEach(card => {
    const productName = card.querySelector('h3').textContent.toLowerCase();
    if (productName.includes(query)) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

if (productSearch) {
  productSearch.addEventListener('input', filterProducts);
}
if (searchBtn) {
  searchBtn.addEventListener('click', filterProducts);
}

// --- Mobile Menu ---
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}