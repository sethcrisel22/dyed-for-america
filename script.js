// script.js — Phase 2 (fixed)
// ALL event listeners are inside DOMContentLoaded to prevent
// null-reference crashes when the script runs before the DOM is ready.
 
/* ══════════════════════════════════════════════════════════════
   CATEGORY DEFINITIONS — 9 tiles
══════════════════════════════════════════════════════════════ */
const CATEGORIES = [
  { key: "bedspread",  label: "Bed Spreads",                         icon: "fas fa-bed" },
  { key: "sweatshirt", label: "Sweatshirts",                         icon: "fas fa-tshirt" },
  { key: "pants",      label: "Pants",                               icon: "fas fa-person" },
  { key: "shirt",      label: "Shirts",                              icon: "fas fa-tshirt" },
  { key: "tapestry",   label: "Tapestries",                          icon: "fas fa-scroll" },
  { key: "socks",      label: "Socks",                               icon: "fas fa-socks" },
  { key: "hat-pin",    label: "Hat Pins",                            icon: "fas fa-thumbtack" },
  { key: "hat",        label: "Hats",                                icon: "fas fa-hat-cowboy" },
  { key: "treasure",   label: "Capn\u2019 Tie Dye\u2019s Treasure Chest", icon: "fas fa-box-open" },
];
 
// Map old category keys → new keys
const CAT_ALIASES = {
  bedding:  "bedspread",
  hoodie:   "sweatshirt",
};
 
/* ══════════════════════════════════════════════════════════════
   STATE
══════════════════════════════════════════════════════════════ */
let allProducts = [];
let catProducts = {};
let tileState   = {};
let lbProducts  = [];
let lbIndex     = 0;
 
/* ══════════════════════════════════════════════════════════════
   BOOT — everything starts here
══════════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", async () => {
  await loadProducts();
  buildCategoryIndex();
  buildGrid();
  initLightboxListeners();   // ← was outside before; now safely inside
  initCategoryPageListeners();
  initScrollCue();
  initContactForm();
  initNavbarScroll();
});
 
/* ══════════════════════════════════════════════════════════════
   LOAD PRODUCTS
══════════════════════════════════════════════════════════════ */
async function loadProducts() {
  if (window.firebaseReady && window.db) {
    try {
      const snap = await window.db
        .collection("products")
        .orderBy("createdAt", "desc")
        .get()
        .catch(() => window.db.collection("products").get());
 
      if (!snap.empty) {
        allProducts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        return;
      }
    } catch (e) {
      console.warn("Firestore read failed, using fallback:", e.message);
    }
  }
  // Fallback to products.js
  if (typeof window.products !== "undefined") {
    allProducts = window.products;
  }
}
 
/* ══════════════════════════════════════════════════════════════
   BUILD CATEGORY INDEX
══════════════════════════════════════════════════════════════ */
function buildCategoryIndex() {
  CATEGORIES.forEach(c => { catProducts[c.key] = []; });
  allProducts.forEach(p => {
    let key = (p.cat || "").toLowerCase().trim();
    if (CAT_ALIASES[key]) key = CAT_ALIASES[key];
    if (catProducts[key] !== undefined) {
      catProducts[key].push(p);
    }
  });
}
 
/* ══════════════════════════════════════════════════════════════
   BUILD 3×3 GRID
══════════════════════════════════════════════════════════════ */
function buildGrid() {
  const grid = document.getElementById("gallery-grid");
  if (!grid) return;
  grid.innerHTML = "";
 
  CATEGORIES.forEach(cat => {
    const prods = catProducts[cat.key] || [];
    tileState[cat.key] = { idx: 0 };
 
    const tile = document.createElement("div");
    tile.className = "cat-tile";
    tile.dataset.cat = cat.key;
 
    // Count badge
    const count = document.createElement("div");
    count.className = "cat-count" + (prods.length === 0 ? " empty" : "");
    count.textContent = prods.length > 0
      ? `${prods.length} item${prods.length !== 1 ? "s" : ""}`
      : "Coming Soon";
    tile.appendChild(count);
 
    // Carousel
    const carousel = document.createElement("div");
    carousel.className = "cat-carousel";
    carousel.id = `carousel-${cat.key}`;
 
    if (prods.length === 0) {
      const ph = document.createElement("div");
      ph.className = "cat-slide";
      ph.innerHTML = `
        <div class="cat-slide-placeholder">
          <i class="${cat.icon}"></i>
          <span>Coming Soon</span>
        </div>`;
      carousel.appendChild(ph);
    } else {
      prods.forEach((p, i) => {
        const slide = document.createElement("div");
        slide.className = "cat-slide";
 
        const img = document.createElement("img");
        img.src     = p.img || "";
        img.alt     = p.name || "";
        img.loading = "lazy";
        img.onerror = function() { this.src = "Logo.png"; };
        img.addEventListener("click", e => {
          e.stopPropagation();
          openLightbox(prods, i);
        });
        slide.appendChild(img);
 
        if (p.status === "sold_out") {
          const so = document.createElement("div");
          so.className = "slide-sold-overlay";
          so.innerHTML = `<div class="slide-sold-badge">Sold Out</div>`;
          slide.appendChild(so);
        }
 
        carousel.appendChild(slide);
      });
    }
    tile.appendChild(carousel);
 
    // Gradient overlay
    const overlay = document.createElement("div");
    overlay.className = "cat-tile-overlay";
    tile.appendChild(overlay);
 
    // Dots
    if (prods.length > 1) {
      const dotsWrap = document.createElement("div");
      dotsWrap.className = "cat-dots";
      dotsWrap.id = `dots-${cat.key}`;
      prods.forEach((_, i) => {
        const dot = document.createElement("div");
        dot.className = "cat-dot" + (i === 0 ? " active" : "");
        dotsWrap.appendChild(dot);
      });
      tile.appendChild(dotsWrap);
    }
 
    // Label row
    const label = document.createElement("div");
    label.className = "cat-label";
 
    const nameEl = document.createElement("div");
    nameEl.className = "cat-name";
    nameEl.textContent = cat.label;
    nameEl.addEventListener("click", e => {
      e.stopPropagation();
      openCategoryPage(cat.key, cat.label);
    });
    label.appendChild(nameEl);
 
    if (prods.length > 1) {
      const nav = document.createElement("div");
      nav.className = "cat-nav";
 
      const prevBtn = document.createElement("button");
      prevBtn.className = "cat-nav-btn";
      prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
      prevBtn.addEventListener("click", e => { e.stopPropagation(); slideTile(cat.key, -1); });
 
      const nextBtn = document.createElement("button");
      nextBtn.className = "cat-nav-btn";
      nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
      nextBtn.addEventListener("click", e => { e.stopPropagation(); slideTile(cat.key, 1); });
 
      nav.appendChild(prevBtn);
      nav.appendChild(nextBtn);
      label.appendChild(nav);
    }
 
    tile.appendChild(label);
 
    // Touch swipe on tile
    if (prods.length > 1) {
      let tsX = 0;
      tile.addEventListener("touchstart", e => { tsX = e.touches[0].clientX; }, { passive: true });
      tile.addEventListener("touchend", e => {
        const dx = e.changedTouches[0].clientX - tsX;
        if (Math.abs(dx) > 30) slideTile(cat.key, dx < 0 ? 1 : -1);
      }, { passive: true });
    }
 
    grid.appendChild(tile);
  });
}
 
/* ══════════════════════════════════════════════════════════════
   CAROUSEL SLIDE
══════════════════════════════════════════════════════════════ */
function slideTile(catKey, dir) {
  const prods = catProducts[catKey] || [];
  if (prods.length <= 1) return;
 
  const state = tileState[catKey];
  state.idx = (state.idx + dir + prods.length) % prods.length;
 
  const carousel = document.getElementById(`carousel-${catKey}`);
  if (carousel) carousel.style.transform = `translateX(-${state.idx * 100}%)`;
 
  const dotsWrap = document.getElementById(`dots-${catKey}`);
  if (dotsWrap) {
    dotsWrap.querySelectorAll(".cat-dot").forEach((d, i) =>
      d.classList.toggle("active", i === state.idx)
    );
  }
}
 
/* ══════════════════════════════════════════════════════════════
   CATEGORY PAGE OVERLAY
══════════════════════════════════════════════════════════════ */
function openCategoryPage(catKey, catLabel) {
  const overlay = document.getElementById("cat-overlay");
  const titleEl = document.getElementById("cat-page-title");
  const gridEl  = document.getElementById("cat-page-grid");
  const prods   = catProducts[catKey] || [];
 
  titleEl.textContent = catLabel;
  gridEl.innerHTML = "";
 
  if (prods.length === 0) {
    gridEl.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:60px 20px;opacity:.6;">
        <i class="fas fa-box-open" style="font-size:48px;color:var(--gold);margin-bottom:20px;display:block"></i>
        <p style="font-family:'Teko',sans-serif;font-size:24px;letter-spacing:.1em;text-transform:uppercase;">
          More treasure arriving soon!
        </p>
      </div>`;
  } else {
    prods.forEach((p, i) => {
      const isSold = p.status === "sold_out";
      const card = document.createElement("div");
      card.className = "cp-card";
      card.innerHTML = `
        <div class="cp-img-wrap">
          <img src="${p.img || 'Logo.png'}" alt="${p.name}" loading="lazy" onerror="this.src='Logo.png'">
          <div class="cp-size-badge">Size: ${p.size || "OS"}</div>
          ${isSold ? `<div class="cp-sold-overlay"><div class="cp-sold-badge">Sold Out</div></div>` : ""}
        </div>
        <div class="cp-info">
          <div class="cp-cat">${catLabel}</div>
          <div class="cp-name">${p.name}</div>
          <div class="cp-desc">${p.desc || ""}</div>
          <div class="cp-foot">
            <div class="cp-price">$${p.price}</div>
            ${isSold
              ? `<span class="cp-buy-disabled">Sold Out</span>`
              : `<a class="cp-buy" href="${p.link}" target="_blank" rel="noopener">
                   Buy Now <i class="fas fa-arrow-right"></i>
                 </a>`
            }
          </div>
        </div>`;
      card.querySelector(".cp-img-wrap").addEventListener("click", () => openLightbox(prods, i));
      gridEl.appendChild(card);
    });
  }
 
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
}
 
function closeCategoryPage() {
  document.getElementById("cat-overlay").classList.remove("open");
  document.body.style.overflow = "";
}
 
function initCategoryPageListeners() {
  const backBtn = document.getElementById("cat-back");
  if (backBtn) backBtn.addEventListener("click", closeCategoryPage);
}
 
/* ══════════════════════════════════════════════════════════════
   LIGHTBOX
══════════════════════════════════════════════════════════════ */
function openLightbox(prods, startIdx) {
  lbProducts = prods;
  lbIndex    = startIdx;
 
  const track    = document.getElementById("lb-track");
  const dotsWrap = document.getElementById("lb-dots");
 
  track.innerHTML = "";
  prods.forEach(p => {
    const slide = document.createElement("div");
    slide.className = "lb-slide";
    slide.innerHTML = `<img src="${p.img || 'Logo.png'}" alt="${p.name}" onerror="this.src='Logo.png'">`;
    track.appendChild(slide);
  });
 
  dotsWrap.innerHTML = "";
  prods.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.className = "lb-dot";
    dot.addEventListener("click", () => goLightbox(i));
    dotsWrap.appendChild(dot);
  });
 
  document.getElementById("lightbox").classList.add("open");
  document.body.style.overflow = "hidden";
  goLightbox(startIdx);
}
 
function goLightbox(idx) {
  lbIndex = idx;
  const p = lbProducts[idx];
 
  document.getElementById("lb-track").style.transform = `translateX(-${idx * 100}%)`;
  document.getElementById("lb-name").textContent  = p.name  || "";
  document.getElementById("lb-size").textContent  = p.size  ? `Size: ${p.size}` : "";
  document.getElementById("lb-desc").textContent  = p.desc  || "";
  document.getElementById("lb-price").textContent = p.price ? `$${p.price}` : "";
 
  const buyBtn = document.getElementById("lb-buy");
  if (p.status === "sold_out") {
    buyBtn.textContent = "Sold Out";
    buyBtn.style.background     = "#9ca3af";
    buyBtn.style.pointerEvents  = "none";
    buyBtn.href = "#";
  } else {
    buyBtn.innerHTML = 'Buy Now <i class="fas fa-arrow-right"></i>';
    buyBtn.style.background    = "";
    buyBtn.style.pointerEvents = "";
    buyBtn.href = p.link || "#";
  }
 
  document.querySelectorAll("#lb-dots .lb-dot").forEach((d, i) =>
    d.classList.toggle("active", i === idx)
  );
}
 
function closeLightbox() {
  document.getElementById("lightbox").classList.remove("open");
  document.body.style.overflow = "";
}
 
/* All lightbox event listeners safely inside DOMContentLoaded via initLightboxListeners() */
function initLightboxListeners() {
  document.getElementById("lb-close").addEventListener("click", closeLightbox);
 
  document.getElementById("lb-prev").addEventListener("click", () => {
    if (lbProducts.length > 1)
      goLightbox((lbIndex - 1 + lbProducts.length) % lbProducts.length);
  });
 
  document.getElementById("lb-next").addEventListener("click", () => {
    if (lbProducts.length > 1)
      goLightbox((lbIndex + 1) % lbProducts.length);
  });
 
  // Keyboard nav
  document.addEventListener("keydown", e => {
    const lb = document.getElementById("lightbox");
    if (e.key === "Escape") {
      if (lb.classList.contains("open")) { closeLightbox(); return; }
      closeCategoryPage();
      return;
    }
    if (!lb.classList.contains("open") || lbProducts.length <= 1) return;
    if (e.key === "ArrowLeft")  goLightbox((lbIndex - 1 + lbProducts.length) % lbProducts.length);
    if (e.key === "ArrowRight") goLightbox((lbIndex + 1) % lbProducts.length);
  });
 
  // Touch swipe on lightbox
  const lb = document.getElementById("lightbox");
  let tsX = 0;
  lb.addEventListener("touchstart", e => { tsX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", e => {
    const dx = e.changedTouches[0].clientX - tsX;
    if (Math.abs(dx) > 40 && lbProducts.length > 1) {
      goLightbox(dx < 0
        ? (lbIndex + 1) % lbProducts.length
        : (lbIndex - 1 + lbProducts.length) % lbProducts.length);
    }
  }, { passive: true });
}
 
/* ══════════════════════════════════════════════════════════════
   SCROLL CUE
══════════════════════════════════════════════════════════════ */
function initScrollCue() {
  const cue = document.getElementById("scroll-cue");
  if (!cue) return;
 
  const hide = () => {
    const shop = document.getElementById("shop");
    if (!shop) return;
    cue.classList.toggle("hidden", shop.getBoundingClientRect().bottom < window.innerHeight * 0.5);
  };
  window.addEventListener("scroll", hide, { passive: true });
 
  cue.style.cursor = "pointer";
  cue.addEventListener("click", () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  });
}
 
/* ══════════════════════════════════════════════════════════════
   NAVBAR SCROLL
══════════════════════════════════════════════════════════════ */
function initNavbarScroll() {
  const nav = document.getElementById("navbar");
  if (!nav) return;
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 60);
  }, { passive: true });
}
 
/* ══════════════════════════════════════════════════════════════
   CONTACT FORM
══════════════════════════════════════════════════════════════ */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    alert("Thank you for your message! We will get back to you soon.");
    form.reset();
  });
}
