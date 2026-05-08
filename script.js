// script.js

// --- 1. CORE UI & NAVIGATION ---
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 60);
        });
    }

    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
        mobileMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });
    }

    if (typeof products !== 'undefined' && products.length > 0) {
        displayProducts('all');
        initFilters();
    } else {
        const productGrid = document.getElementById('product-grid');
        if(productGrid) productGrid.innerHTML = '<p>No products available at this time. Please check back soon!</p>';
        console.error("Product data (products.js) is missing or empty.");
    }

    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal:not(.product-card)').forEach(el => {
        revealObserver.observe(el);
    });
});

// --- 2. DYNAMIC SHOP ENGINE ---
const productGrid = document.getElementById('product-grid');

function displayProducts(filter = 'all') {
    if (!productGrid) return;
    
    productGrid.innerHTML = ''; 

    const filteredProducts = products.filter(product => filter === 'all' || product.cat === filter);

    if (filteredProducts.length === 0) {
        productGrid.innerHTML = `<p style="text-align: center; grid-column: 1 / -1;">No products found in this category.</p>`;
        return;
    }

    filteredProducts.forEach(product => {
        const isSold = product.status === 'sold';
        const card = document.createElement('article');
        card.className = `product-card reveal in`;

        // UPDATED: The onerror fallback now points to the public URL for the logo.
        card.innerHTML = `
            <div class="product-img-wrap">
                ${isSold ? '<div class="product-badge featured">SOLD</div>' : '<div class="product-badge">1 OF 1</div>'}
                <div class="product-badge sz">${product.size}</div>
                <img src="${product.img}" alt="${product.name}" onerror="this.onerror=null;this.src='https://i.postimg.cc/P5g42p5w/Logo.png';" style="${isSold ? 'filter: grayscale(1)' : ''}">
            </div>
            <div class="product-info">
                <div class="product-cat">ID: #${product.id} &middot; ${product.cat.toUpperCase()}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-desc">${product.desc}</p>
                <div class="product-foot">
                    <div class="product-price">$${product.price}</div>
                    ${isSold 
                        ? '<button class="buy-btn" disabled>SOLD OUT</button>' 
                        : `<a href="#" onclick="goToStripe('${product.id}', '${product.cat}'); return false;" class="buy-btn">Buy Now <i class="fas fa-arrow-right"></i></a>`
                    }
                </div>
            </div>
        `;
        productGrid.appendChild(card);
    });
}

function goToStripe(id, category) {
    if (stripeLinks && stripeLinks[category]) {
        const url = `${stripeLinks[category]}?client_reference_id=${id}`;
        window.location.href = url;
    } else {
        console.error(`Stripe link for category "${category}" not found.`);
        alert('Sorry, there was an error processing this item. Please contact support.');
    }
}

// --- 3. FILTER BUTTON LOGIC ---
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            displayProducts(this.dataset.filter);
        });
    });
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
