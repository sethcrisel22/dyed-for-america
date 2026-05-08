// --- UI LOGIC ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => { if(navbar) navbar.classList.toggle('scrolled', window.scrollY > 60); });

const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if(hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });
}

function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

// --- DYNAMIC SHOP ENGINE ---
const container = document.getElementById('product-grid');

function displayProducts(filterValue = 'all') {
    if (!container) return;
    container.innerHTML = ''; 

    const filtered = products.filter(item => filterValue === 'all' || item.cat === filterValue);

    filtered.forEach(item => {
        const isSold = item.status === 'sold';
        const card = document.createElement('article');
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
    const baseLink = stripeLinks[category];
    if (baseLink) {
        // We still send the ID to Stripe so it shows up in your dashboard automatically
        window.location.href = `${baseLink}?client_reference_id=${id}`;
    } else {
        alert("Payment link for this category not found.");
    }
}

// --- FILTERING ---
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        displayProducts(this.dataset.filter);
    });
});

// Start Shop
if (typeof products !== 'undefined') { displayProducts(); }
