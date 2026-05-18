// script.js
// Loads products from Firestore when Firebase is configured.
// Falls back to the local products.js array automatically.
 
document.addEventListener("DOMContentLoaded", async () => {
 
  // ── DOM refs ────────────────────────────────────────────────────
  const productGrid = document.getElementById("product-grid");
  const filterBtns  = document.querySelectorAll(".filter-btn");
 
  // Master product list (populated below)
  let allProducts = [];
  // Track which category is active for re-renders
  let activeFilter = "all";
 
  // ── Render ───────────────────────────────────────────────────────
  function renderProducts(filterCategory = "all") {
    activeFilter = filterCategory;
    productGrid.innerHTML = "";
 
    const filtered = allProducts.filter(p =>
      filterCategory === "all" || p.cat === filterCategory
    );
 
    if (filtered.length === 0) {
      productGrid.innerHTML = `<p style="grid-column:1/-1;text-align:center;padding:40px 0;opacity:.7;">
        More items coming soon to this category!
      </p>`;
      return;
    }
 
    filtered.forEach(product => {
      const isSoldOut = product.status === "sold_out";
      const card = document.createElement("div");
      card.className = "product-card";
 
      card.innerHTML = `
        <div class="product-img-wrap">
          <img src="${product.img}" alt="${product.name}" loading="lazy">
          <div class="product-badge sz">Size: ${product.size}</div>
          ${isSoldOut ? '<div class="product-badge">Sold Out</div>' : ""}
        </div>
        <div class="product-info">
          <div class="product-cat">${product.cat}</div>
          <h3 class="product-name">${product.name}</h3>
          <p class="product-desc">${product.desc}</p>
          <div class="product-foot">
            <div class="product-price">$${product.price}</div>
            ${isSoldOut
              ? `<span class="buy-btn" style="background:#9ca3af;cursor:not-allowed;">Sold Out</span>`
              : `<a href="${product.link}" class="buy-btn" target="_blank" rel="noopener noreferrer">
                   Buy Now <i class="fas fa-arrow-right"></i>
                 </a>`
            }
          </div>
        </div>`;
 
      productGrid.appendChild(card);
    });
  }
 
  // ── Load products ────────────────────────────────────────────────
  async function loadProducts() {
    // 1. Try Firestore
    if (window.firebaseReady && window.db) {
      try {
        const snap = await window.db
          .collection("products")
          .orderBy("createdAt", "desc")
          .get();
 
        if (!snap.empty) {
          allProducts = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          console.log(`📦 ${allProducts.length} products loaded from Firestore.`);
          return;
        }
      } catch (err) {
        // Firestore order might fail if index isn't built yet; try without order
        try {
          const snap = await window.db.collection("products").get();
          if (!snap.empty) {
            allProducts = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log(`📦 ${allProducts.length} products loaded from Firestore (unordered).`);
            return;
          }
        } catch (e2) {
          console.warn("Firestore read failed:", e2.message);
        }
      }
    }
 
    // 2. Fall back to local products.js array
    if (typeof window.products !== "undefined" && window.products.length) {
      allProducts = window.products;
      console.log(`📦 ${allProducts.length} products loaded from products.js (fallback).`);
    } else {
      productGrid.innerHTML = `<p style="grid-column:1/-1;text-align:center;">
        No products found. Please check your setup.
      </p>`;
    }
  }
 
  // ── Boot ─────────────────────────────────────────────────────────
  productGrid.innerHTML = `<p style="grid-column:1/-1;text-align:center;padding:40px 0;opacity:.7;">
    Loading products…
  </p>`;
 
  await loadProducts();
  renderProducts("all");
 
  // ── Filter buttons ───────────────────────────────────────────────
  filterBtns.forEach(btn => {
    btn.addEventListener("click", e => {
      filterBtns.forEach(b => b.classList.remove("active"));
      e.currentTarget.classList.add("active");
      renderProducts(e.currentTarget.getAttribute("data-filter"));
    });
  });
 
  // ── Navbar scroll ────────────────────────────────────────────────
  const navbar = document.getElementById("navbar");
  if (navbar) {
    const onScroll = () => navbar.classList.toggle("scrolled", window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
  }
 
  // ── Contact form ─────────────────────────────────────────────────
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", e => {
      e.preventDefault();
      alert("Thank you for your message! We will get back to you soon.");
      contactForm.reset();
    });
  }
});
 
