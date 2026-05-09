// script.js
// This file controls the dynamic rendering of products and user interactions.

document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('product-grid');
    const filterBar = document.getElementById('filter-bar');

    if (!productGrid || !filterBar) {
        console.error("Initialization failed: Essential HTML elements are missing.");
        return;
    }
    if (typeof products === 'undefined' || !Array.isArray(products)) {
        productGrid.innerHTML = "<p>Error: Product data could not be loaded.</p>";
        console.error("Product data from products.js is missing or invalid.");
        return;
    }

    const renderProducts = (filter = 'all') => {
        const filtered = products.filter(p => filter === 'all' || p.cat === filter);
        productGrid.innerHTML = ''; // Clear previous items

        if (filtered.length === 0) {
            productGrid.innerHTML = `<p style="grid-column: 1 / -1; text-align: center;">No products found in this category.</p>`;
            return;
        }

        filtered.forEach(product => {
            const card = document.createElement('article');
            card.className = 'product-card';
            const isSold = product.status === 'sold';

            const imgWrap = document.createElement('div');
            imgWrap.className = 'product-img-wrap';
            
            const badge1 = document.createElement('div');
            badge1.className = isSold ? 'product-badge featured' : 'product-badge';
            badge1.textContent = isSold ? 'SOLD' : '1 OF 1';

            const badge2 = document.createElement('div');
            badge2.className = 'product-badge sz';
            badge2.textContent = product.size;

            const img = document.createElement('img');
            img.src = product.img;
            img.alt = product.name;
            img.onerror = () => { img.src = 'https://i.postimg.cc/P5g42p5w/Logo.png'; };

            imgWrap.append(badge1, badge2, img);

            const info = document.createElement('div');
            info.className = 'product-info';

            const cat = document.createElement('div');
            cat.className = 'product-cat';
            cat.textContent = `ID: #${product.id} · ${product.cat.toUpperCase()}`;

            const name = document.createElement('h3');
            name.className = 'product-name';
            name.textContent = product.name;

            const desc = document.createElement('p');
            desc.className = 'product-desc';
            desc.textContent = product.desc;

            const foot = document.createElement('div');
            foot.className = 'product-foot';

            const price = document.createElement('div');
            price.className = 'product-price';
            price.textContent = `$${product.price}`;

            const buyBtn = document.createElement('button');
            buyBtn.className = 'buy-btn';
            buyBtn.dataset.id = product.id;
            buyBtn.dataset.cat = product.cat;
            buyBtn.disabled = isSold;
            buyBtn.innerHTML = isSold ? 'SOLD OUT' : 'Buy Now <i class="fas fa-arrow-right"></i>';

            foot.append(price, buyBtn);
            info.append(cat, name, desc, foot);
            card.append(imgWrap, info);
            productGrid.appendChild(card);
        });
    };

    filterBar.addEventListener('click', (e) => {
        if (e.target.matches('.filter-btn')) {
            filterBar.querySelector('.active').classList.remove('active');
            e.target.classList.add('active');
            renderProducts(e.target.dataset.filter);
        }
    });

    productGrid.addEventListener('click', (e) => {
        const buyButton = e.target.closest('.buy-btn:not(:disabled)');
        if (buyButton) {
            const { id, cat } = buyButton.dataset;
            if (stripeLinks[cat]) {
                window.location.href = `${stripeLinks[cat]}?client_reference_id=${id}`;
            } else {
                console.error(`Stripe link for category "${cat}" not found.`);
                alert('Payment link for this item is currently unavailable.');
            }
        }
    });

    renderProducts('all');
});
