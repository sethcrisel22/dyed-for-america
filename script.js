// 1. UI LOGIC (Menus & Scrolling)
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

// 2. PRODUCT ENGINE
const container = document.getElementById('product-grid');

function displayProducts(filterValue = 'all') {
    if (!container) return;
    container.innerHTML = ''; 

    // Use products from products.js
    const filtered = products.filter(item => filterValue === 'all' || item.cat === filterValue);

    filtered.forEach(item => {
        const isSold = item.status === 'sold';
        const card = document.createElement('article');
        card.className = `product-card reveal in ${isSold ? 'sold-out' : ''}`;
        
        card.innerHTML = `
            <div class="product-img-wrap">
                ${isSold ? '<div class="product-badge featured" style="background:var(--red)">SOLD</div>' : '<div class="product-badge">1 OF 1</div>'}
                <div class="product-badge sz">${item.size}</div>
                <img src="${item.img}" alt="${item.name}" style="${isSold ? 'filter: grayscale(1) opacity(0.4)' : ''}">
            </div>
            <div class="product-info">
                <div class="product-cat">ID: #${item.id} &middot; ${item.cat.toUpperCase()}</div>
                <div class="product-name">${item.name}</div>
                <div class="product-foot">
                    <div class="product-price">$${item.price}</div>
                    ${isSold 
                        ? '<button class="buy-btn" style="background:#666" disabled>SOLD OUT</button>' 
                        : `<button onclick="goToStripe('${item.id}', '${item.price}')" class="buy-btn">Buy <i class="fas fa-arrow-right"></i></button>`
                    }
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function goToStripe(id, price) {
    const baseLink = stripeLinks[price];
    if (baseLink) {
        window.location.href = `${baseLink}?client_reference_id=${id}`;
    }
}

// 3. FILTER BUTTON LOGIC
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        displayProducts(this.dataset.filter);
    });
});

// 4. ANIMATION OBSERVER
const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('in'); });
}, {threshold: 0.1});
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// 5. START SHOP
if (typeof products !== 'undefined') {
    displayProducts();
}
