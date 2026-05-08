console.log("Script.js loaded...");

// --- UI LOGIC ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => { navbar.classList.toggle('scrolled', window.scrollY > 60); });

const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if(hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });
}

function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

// --- THE SHOP ENGINE ---
const container = document.getElementById('product-grid');

function displayProducts(filterValue = 'all') {
    console.log("Displaying products for filter:", filterValue);
    if (!container) {
        console.error("Product grid container not found!");
        return;
    }
    container.innerHTML = ''; 

    // Use the 'products' array from products.js
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
                        : `<button onclick="goToStripe('${item.id}', '${item.price}')" class="buy-btn">Buy Now</button>`
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

// --- NEW FILTER LOGIC ---
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        displayProducts(this.dataset.filter);
    });
});

// Run the engine
if (typeof products !== 'undefined') {
    console.log("Products data found. Initializing shop...");
    displayProducts();
} else {
    console.error("The 'products' array is missing! Check products.js");
}
