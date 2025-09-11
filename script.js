const API_BASE = "http://mongodb+srv://sammamahmed:<K6nNEteroAXrGo9o>@cluster0.pmnr1p3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/api"; 
// mongodb+srv://sammamahmed:<K6nNEteroAXrGo9o>@cluster0.pmnr1p3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
// --- Cart logic as before ---
let cart = JSON.parse(localStorage.getItem('cart')) || {};
const cartCountElement = document.getElementById('cart-count');
const addToCartButtons = document.querySelectorAll('.buy-btn');
const cartBtn = document.getElementById('cart-btn');
const cartMenu = document.getElementById('cart-menu');
const cartItemsDiv = document.getElementById('cart-items');
const cartTotalDiv = document.getElementById('cart-total');
const closeCartMenuBtn = document.getElementById('close-cart-menu');
const removeAllBtn = document.getElementById('remove-all-btn');

function updateCartCount() {
  const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
  if (cartCountElement) cartCountElement.textContent = totalItems;
}
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}
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
if (cartBtn && cartMenu) {
  cartBtn.addEventListener('click', function() {
    renderCartMenu();
    cartMenu.style.display = 'block';
  });
}
if (removeAllBtn) {
  removeAllBtn.onclick = function() {
    cart = {};
    saveCart();
    updateCartCount();
    renderCartMenu();
  };
}
if (closeCartMenuBtn && cartMenu) {
  closeCartMenuBtn.addEventListener('click', function() {
    cartMenu.style.display = 'none';
  });
}
updateCartCount();

// --- Contact Form API Submission ---
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = contactForm.querySelector('#name').value;
    const email = contactForm.querySelector('#email').value;
    const message = contactForm.querySelector('#message').value;
    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      if (res.ok) {
        alert('Message sent! Thank you.');
        contactForm.reset();
      } else {
        alert('Error sending message.');
      }
    } catch (err) {
      alert('Error sending message.');
    }
  });
}

// --- Review Form API Submission & Fetch Reviews ---
const reviewForm = document.querySelector('.review-form');
const reviewsListDiv = document.getElementById('reviews-list');
async function loadReviews() {
  if (!reviewsListDiv) return;
  try {
    const res = await fetch(`${API_BASE}/review`);
    if (res.ok) {
      const reviews = await res.json();
      reviewsListDiv.innerHTML = reviews.length
        ? '<h3>Recent Reviews:</h3>' +
          reviews.map(r => `<div><strong>${r.name}</strong>: ${r.message}</div>`).join('')
        : '<em>No reviews yet.</em>';
    }
  } catch (err) {
    reviewsListDiv.innerHTML = '<em>Error loading reviews.</em>';
  }
}
if (reviewForm) {
  reviewForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = reviewForm.querySelector('#reviewer-name').value;
    const message = reviewForm.querySelector('#review-message').value;
    try {
      const res = await fetch(`${API_BASE}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message }),
      });
      if (res.ok) {
        alert('Review submitted! Thank you.');
        reviewForm.reset();
        loadReviews();
      } else {
        alert('Error submitting review.');
      }
    } catch (err) {
      alert('Error submitting review.');
    }
  });
  loadReviews();
}

// --- Product Search Bar ---
const productSearch = document.getElementById('product-search');
const searchBtn = document.getElementById('search-btn');
const productCards = document.querySelectorAll('.product-card');
function filterProducts() {
  const query = productSearch.value.toLowerCase();
  productCards.forEach(card => {
    const productName = card.querySelector('h3').textContent.toLowerCase();
    card.style.display = productName.includes(query) ? '' : 'none';
  });
}
if (productSearch) {
  productSearch.addEventListener('input', filterProducts);
}
if (searchBtn) {
  searchBtn.addEventListener('click', filterProducts);
}

// --- Mobile Menu (if present) ---
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}