// script.js

// --- 1. MAIN INITIALIZATION ---
// This runs after the HTML document has been fully loaded and parsed.
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded. Initializing site...");

    // Setup UI elements like navbar and mobile menu
    initializeUI();

    // Setup the dynamic shop section
    initializeShop();

    // Setup scroll-triggered animations for static content
    initializeScrollAnimations();
});


// --- 2. UI INITIALIZATION ---
function initializeUI() {
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 60);
        });
    }

    // Mobile hamburger menu toggle
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
    }
}


// --- 3. SHOP ENGINE ---
function initializeShop() {
    const productGrid = document.getElementById('product-grid');
    const filterBar = document.getElementById('filter-bar');

    // Safety check: if essential elements don't exist, stop.
    if (!productGrid || !filterBar) {
        console.error("Shop initialization failed: Product grid or filter bar not found.");
        return;
    }

    // Check if product data is available from products.js
    if (typeof products === 'undefined' || products.length === 0) {
        console.error("Product data is missing or empty.");
        productGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1;">Could not load product data.</p>';
        return;
    }

    console.log(`Found ${products.length} products. Ready to render.`);

    // --- Event Listener for Filter Buttons ---
    filterBar.addEventListener('click', (event) => {
        // Check if a filter button was actually clicked
        if (event.target.classList.contains('filter-btn')) {
            const filterValue = event.target.dataset.filter;
            
            // Update active state on buttons
            filterBar.querySelector('.active').classList.remove('active');
            event.target.classList.add('active');
            
            console.log(`Filtering by: ${filterValue}`);
            renderProducts(filterValue);
        }
    });

    // --- Event Listener for Buy Buttons (Event Delegation) ---
    productGrid.addEventListener('click', (event) => {
        const buyButton = event.target.closest('.buy-btn');
        if (buyButton && !buyButton.disabled) {
            const productId = buyButton.dataset.id;
            const productCat = buyButton.dataset.cat;
            goToStripe(productId, productCat);
        }
    });

    // Initial render of all products
    renderProducts('all');
}

/**
 * Renders products into the grid based on the selected category.
 * @param {string} filter - The category to display (e.g., 'shirt', 'all').
 */
function renderProducts(filter = 'all') {
    const productGrid = document.getElementById('product-grid');
    
    try {
        const filtered = products.filter(p => filter === 'all' || p.cat === filter);

        // Clear the grid before rendering new items
        productGrid.innerHTML = '';

        if (filtered.length === 0) {
            productGrid.innerHTML = `<p style="text-align: center; grid-column: 1 / -1;">No products found in this category.</p>`;
            return;
        }

        filtered.forEach(product => {
            const isSold = product.status === 'sold';
            const card = document.createElement('article');
            card.className = 'product-card reveal in'; // 'in' class makes it visible immediately

            card.innerHTML = `
                <div class="product-img-wrap">
                    ${isSold ? '<div class="product-badge featured">SOLD</div>' : '<div class="product-badge">1 OF 1</div>'}
                    <div class="product-badge sz">${product.size}</div>
                    <img src="${product.img}" alt="${product.name}" onerror="this.onerror=null;this.src='https://i.postimg.cc/P5g42p5w/Logo.png';">
                </div>
                <div class="product-info">
                    <div class="product-cat">ID: #${product.id} &middot; ${product.cat.toUpperCase()}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-desc">${product.desc}</p>
                    <div class="product-foot">
                        <div class="product-price">$${product.price}</div>
                        <button 
                            class="buy-btn" 
                            data-id="${product.id}" 
                            data-cat="${product.cat}" 
                            ${isSold ? 'disabled' : ''}
                        >
                            ${isSold ? 'SOLD OUT' : 'Buy Now <i class="fas fa-arrow-right"></i>'}
                        </button>
                    </div>
                </div>
            `;
            productGrid.appendChild(card);
        });
        console.log(`Successfully rendered ${filtered.length} products.`);

    } catch (error) {
        console.error("CRITICAL ERROR during product rendering:", error);
        productGrid.innerHTML = `<p style="text-align: center; grid-column: 1 / -1; color: var(--red);">A critical error occurred. Please check the console.</p>`;
    }
}

/**
 * Redirects to the appropriate Stripe checkout page.
 * @param {string} id - The product's unique ID.
 * @param {string} category - The product's category.
 */
function goToStripe(id, category) {
    if (typeof stripeLinks !== 'undefined' && stripeLinks[category]) {
        const url = `${stripeLinks[category]}?client_reference_id=${id}`;
        console.log(`Redirecting to Stripe for product ${id}: ${url}`);
        window.location.href = url;
    } else {
        console.error(`Stripe link for category "${category}" not found.`);
        alert('There was an error processing this item. Payment link is missing.');
    }
}


// --- 4. SCROLL ANIMATIONS ---
function initializeScrollAnimations() {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                observer.unobserve(entry.target); // Optional: stop observing after it's visible
            }
        });
    }, { threshold: 0.1 });

    // Find all elements with the .reveal class that are NOT dynamic product cards
    document.querySelectorAll('.reveal:not(.product-card)').forEach(el => {
        revealObserver.observe(el);
    });
}

// Utility to scroll to top, can be used by nav brand
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
