// --- 1. UI & NAVIGATION ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => { 
    if(navbar) navbar.classList.toggle('scrolled', window.scrollY > 60); 
});

const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if(hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });
}

function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

// --- 2. DYNAMIC SHOP ENGINE ---
const container = document.getElementById('product-grid');

function displayProducts(filterValue = 'all') {
    if (!container) return;
    container.innerHTML = ''; 

    // Filter the products array (defined in products.js)
    const filtered = products.filter(item => filterValue === 'all' || item.cat === filterValue);

    filtered.forEach(item => {
        const isSold = item.status === 'sold';
        const card = document.createElement('article');
        
        // We add 'in' class immediately so they aren't hidden by the reveal animation
        card.className = `product-card reveal in ${isSold ? 'sold-out' : ''}`;
        
        card.innerHTML = `
            <div class="product-img-wrap">
                ${isSold ? '<div class="product-badge featured" style="background:var(--red)">SOLD</div>' : '<div class="product-badge">1 OF 1</div>'}
                <div class="product-badge sz">${item.size}</div>
                <img src="${item.img}" alt="${item.name}" onerror="this.src='Logo.png'" style="${isSold ? 'filter: grayscale(1) opacity(0.4)' : ''}">
            </div>
            <div class="product-info">
                <div class="product-cat">ID: #${item.id} &middot; ${item.cat.toUpperCase()}</div>
                <div class="product-name">${item.name}</div>
                <div class="product-foot">
                    <div class="product-price">$${item.price}</div>
                    ${isSold 
                        ? '<button class="buy-btn" style="background:#666" disabled>SOLD OUT</button>' 
                        : `<button onclick="goToStripe('${item.id}', '${item.cat}')" class="buy-btn">Buy <i class="fas fa-arrow-right"></i></button>`
                    }
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function goToStripe(id, category) {
    if (typeof stripeLinks !== 'undefined' && stripeLinks[category]) {
        window.location.href = `${stripeLinks[category]}?client_reference_id=${id}`;
    } else {
        console.error("Stripe link missing for category:", category);
    }
}

// --- 3. FILTER BUTTON LOGIC ---
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            displayProducts(this.dataset.filter);
        });
    });
}

// --- 4. REVEAL ANIMATION OBSERVER ---
const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { 
        if(e.isIntersecting) e.target.classList.add('in'); 
    });
}, { threshold: 0.1 });

// --- 5. INITIALIZE EVERYTHING ---
document.addEventListener('DOMContentLoaded', () => {
    // Check if data is loaded
    if (typeof products !== 'undefined') {
        displayProducts();
        initFilters();
    } else {
        console.error("Inventory data (products.js) not found!");
    }

    // Start animations for static sections
    document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
});
