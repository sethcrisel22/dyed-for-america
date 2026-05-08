// --- UI LOGIC (Navbar, Menus, Forms) ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => { navbar.classList.toggle('scrolled', window.scrollY > 60); }, { passive: true });

const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => { hamburger.classList.toggle('active'); mobileMenu.classList.toggle('active'); });

document.querySelectorAll('.mobile-menu .nav-link,.mobile-menu .nav-cta').forEach(el => {
    el.addEventListener('click', () => { hamburger.classList.remove('active'); mobileMenu.classList.remove('active'); });
});

function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

const toast = document.getElementById('toast');
function showToast(title, msg, ok) {
    document.getElementById('toastTitle').textContent = title;
    document.getElementById('toastMsg').textContent = msg;
    toast.classList.toggle('success', !!ok);
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4200);
}

document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const n = document.getElementById('fname').value.trim(), em = document.getElementById('femail').value.trim(), s = document.getElementById('fsubject').value.trim(), m = document.getElementById('fmessage').value.trim();
    if (!n || !em || !s || !m) { showToast('Incomplete', 'Please fill in all fields.', false); return; }
    const body = 'Name: ' + n + '%0D%0AEmail: ' + em + '%0D%0A%0D%0A' + encodeURIComponent(m);
    showToast('Message Ready', 'Opening your email client...', true);
    setTimeout(() => { window.location.href = 'mailto:DyedForAmerica@Gmail.com?subject=' + encodeURIComponent(s) + '&body=' + body; this.reset(); }, 700);
});

document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
        const t = document.querySelector(this.getAttribute('href'));
        if (t) { e.preventDefault(); window.scrollTo({ top: t.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' }); }
    });
});

// --- E-COMMERCE ENGINE (Dynamic Shop) ---
const container = document.getElementById('product-grid');

function displayProducts(filter = 'all') {
    if (!container) return;
    container.innerHTML = ''; // Clear the grid

    // Filter the products array (which comes from products.js)
    const filteredProducts = products.filter(item => filter === 'all' || item.cat === filter);

    filteredProducts.forEach(item => {
        const isSold = item.status === 'sold';
        const card = document.createElement('article');
        // 'in' class makes them visible instantly
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
    // stripeLinks is defined in your products.js file
    const baseLink = stripeLinks[price];
    if (!baseLink || baseLink.includes("LINK_FOR_")) {
        showToast("Error", "Payment link not configured.", false);
        return;
    }
    // Append the ID to the URL so you know which specific shirt sold in your Stripe notification
    window.location.href = `${baseLink}?client_reference_id=${id}`;
}

// --- FILTER BUTTON LOGIC ---
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filterValue = btn.dataset.filter;
        displayProducts(filterValue);
    });
});

// Initial Load of the Shop
displayProducts();
