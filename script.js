// script.js — Phase 3
// Gallery grid + About section carousels + porthole + video embedding
// ALL event listeners are inside DOMContentLoaded
 
/* ══════════════════════════════════════════════════════════════
   CATEGORY DEFINITIONS — 9 gallery tiles
══════════════════════════════════════════════════════════════ */
const CATEGORIES = [
  { key: "bedspread",  label: "Bed Spreads",                              icon: "fas fa-bed" },
  { key: "sweatshirt", label: "Sweatshirts",                              icon: "fas fa-tshirt" },
  { key: "pants",      label: "Pants",                                    icon: "fas fa-person" },
  { key: "shirt",      label: "Shirts",                                   icon: "fas fa-tshirt" },
  { key: "tapestry",   label: "Tapestries",                               icon: "fas fa-scroll" },
  { key: "socks",      label: "Socks",                                    icon: "fas fa-socks" },
  { key: "hat-pin",    label: "Hat Pins",                                 icon: "fas fa-thumbtack" },
  { key: "hat",        label: "Hats",                                     icon: "fas fa-hat-cowboy" },
  { key: "treasure",   label: "Capn\u2019 Tie Dye\u2019s Treasure Chest", icon: "fas fa-box-open" },
];
 
// About section categories — separate from grid
const ABOUT_CATS = ["d-and-r", "tie-dye-team", "development-process"];
 
// Map old keys to new
const CAT_ALIASES = {
  bedding:  "bedspread",
  hoodie:   "sweatshirt",
};
 
/* ══════════════════════════════════════════════════════════════
   STATE
══════════════════════════════════════════════════════════════ */
let allProducts = [];
let catProducts = {};   // gallery grid products
let aboutProds  = {};   // about section products
let tileState   = {};
let lbProducts  = [];
let lbIndex     = 0;
 
/* ══════════════════════════════════════════════════════════════
   BOOT
══════════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", async () => {
  await loadProducts();
  buildCategoryIndex();
  buildGrid();
  buildAboutSection();
  initLightboxListeners();
  initCategoryPageListeners();
  initScrollCue();
  initContactForm();
  initAboardForm();
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
      console.warn("Firestore fallback:", e.message);
    }
  }
  if (typeof window.products !== "undefined") allProducts = window.products;
}
 
/* ══════════════════════════════════════════════════════════════
   BUILD CATEGORY INDEX
══════════════════════════════════════════════════════════════ */
function buildCategoryIndex() {
  CATEGORIES.forEach(c => { catProducts[c.key] = []; });
  ABOUT_CATS.forEach(k => { aboutProds[k] = []; });
 
  allProducts.forEach(p => {
    let key = (p.cat || "").toLowerCase().trim();
    if (CAT_ALIASES[key]) key = CAT_ALIASES[key];
 
    if (catProducts[key] !== undefined) catProducts[key].push(p);
    if (aboutProds[key]  !== undefined) aboutProds[key].push(p);
  });
}
 
/* ══════════════════════════════════════════════════════════════
   BUILD 3x3 GALLERY GRID
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
      ? `${prods.length} item${prods.length !== 1 ? "s" : ""}` : "Coming Soon";
    tile.appendChild(count);
 
    // Carousel
    const carousel = document.createElement("div");
    carousel.className = "cat-carousel";
    carousel.id = `carousel-${cat.key}`;
 
    if (prods.length === 0) {
      const ph = document.createElement("div");
      ph.className = "cat-slide";
      ph.innerHTML = `<div class="cat-slide-placeholder"><i class="${cat.icon}"></i><span>Coming Soon</span></div>`;
      carousel.appendChild(ph);
    } else {
      prods.forEach((p, i) => {
        const slide = document.createElement("div");
        slide.className = "cat-slide";
        const img = document.createElement("img");
        img.src = p.img || ""; img.alt = p.name || ""; img.loading = "lazy";
        img.onerror = function() { this.src = "Logo.png"; };
        img.addEventListener("click", e => { e.stopPropagation(); openLightbox(prods, i); });
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
    const ov = document.createElement("div");
    ov.className = "cat-tile-overlay";
    tile.appendChild(ov);
 
    // Dots
    if (prods.length > 1) {
      const dw = document.createElement("div");
      dw.className = "cat-dots"; dw.id = `dots-${cat.key}`;
      prods.forEach((_, i) => {
        const d = document.createElement("div");
        d.className = "cat-dot" + (i === 0 ? " active" : "");
        dw.appendChild(d);
      });
      tile.appendChild(dw);
    }
 
    // Label
    const label = document.createElement("div");
    label.className = "cat-label";
    const nameEl = document.createElement("div");
    nameEl.className = "cat-name";
    nameEl.textContent = cat.label;
    nameEl.addEventListener("click", e => { e.stopPropagation(); openCategoryPage(cat.key, cat.label); });
    label.appendChild(nameEl);
 
    if (prods.length > 1) {
      const nav = document.createElement("div");
      nav.className = "cat-nav";
      const pb = document.createElement("button");
      pb.className = "cat-nav-btn";
      pb.innerHTML = '<i class="fas fa-chevron-left"></i>';
      pb.addEventListener("click", e => { e.stopPropagation(); slideTile(cat.key, -1); });
      const nb = document.createElement("button");
      nb.className = "cat-nav-btn";
      nb.innerHTML = '<i class="fas fa-chevron-right"></i>';
      nb.addEventListener("click", e => { e.stopPropagation(); slideTile(cat.key, 1); });
      nav.appendChild(pb); nav.appendChild(nb);
      label.appendChild(nav);
    }
    tile.appendChild(label);
 
    // Touch swipe
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
 
function slideTile(catKey, dir) {
  const prods = catProducts[catKey] || [];
  if (prods.length <= 1) return;
  const state = tileState[catKey];
  state.idx = (state.idx + dir + prods.length) % prods.length;
  const carousel = document.getElementById(`carousel-${catKey}`);
  if (carousel) carousel.style.transform = `translateX(-${state.idx * 100}%)`;
  const dw = document.getElementById(`dots-${catKey}`);
  if (dw) dw.querySelectorAll(".cat-dot").forEach((d, i) => d.classList.toggle("active", i === state.idx));
}
 
/* ══════════════════════════════════════════════════════════════
   ABOUT SECTION — PORTHOLE + CAROUSELS
══════════════════════════════════════════════════════════════ */
function buildAboutSection() {
  buildPortholeCarousel();
  buildAboutCarousel("team",      "team-car-track", "team-car-dots", "team-prev", "team-next", "tie-dye-team",         false);
  buildAboutCarousel("dev",       "dev-car-track",  "dev-car-dots",  "dev-prev",  "dev-next",  "development-process",  true);
}
 
/* ── Porthole D&R carousel ──────────────────────────────────── */
function buildPortholeCarousel() {
  const inner = document.getElementById("dr-porthole-inner");
  const dotsW = document.getElementById("dr-porthole-dots");
  if (!inner) return;
 
  const prods = aboutProds["d-and-r"] || [];
 
  if (prods.length === 0) {
    inner.innerHTML = `<div class="porthole-placeholder"><i class="fas fa-camera"></i><span>D &amp; R</span></div>`;
    return;
  }
 
  // Clear placeholder
  inner.innerHTML = "";
 
  prods.forEach((p, i) => {
    const slide = document.createElement("div");
    slide.className = "porthole-slide" + (i === 0 ? " active" : "");
    const img = document.createElement("img");
    img.src = p.img || ""; img.alt = p.name || "";
    img.onerror = function() { this.src = "Logo.png"; };
    slide.appendChild(img);
    inner.appendChild(slide);
  });
 
  // Build dots
  if (prods.length > 1 && dotsW) {
    prods.forEach((_, i) => {
      const dot = document.createElement("div");
      dot.className = "porthole-dot" + (i === 0 ? " active" : "");
      dotsW.appendChild(dot);
    });
 
    // Auto-rotate every 5 seconds
    let idx = 0;
    const slides = inner.querySelectorAll(".porthole-slide");
    const dots   = dotsW.querySelectorAll(".porthole-dot");
 
    setInterval(() => {
      slides[idx].classList.remove("active");
      dots[idx].classList.remove("active");
      idx = (idx + 1) % prods.length;
      slides[idx].classList.add("active");
      dots[idx].classList.add("active");
    }, 5000);
 
    // Dot click navigation
    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        slides.forEach(s => s.classList.remove("active"));
        dots.forEach(d => d.classList.remove("active"));
        idx = i;
        slides[idx].classList.add("active");
        dots[idx].classList.add("active");
      });
    });
  }
}
 
/* ── Generic about carousel (Team + Dev Process) ────────────── */
function buildAboutCarousel(prefix, trackId, dotsId, prevId, nextId, catKey, isVideo) {
  const track = document.getElementById(trackId);
  const dotsW = document.getElementById(dotsId);
  const prevBtn = document.getElementById(prevId);
  const nextBtn = document.getElementById(nextId);
  if (!track) return;
 
  const prods = aboutProds[catKey] || [];
 
  if (prods.length === 0) {
    // Keep the empty placeholder already in HTML
    if (prevBtn) prevBtn.style.display = "none";
    if (nextBtn) nextBtn.style.display = "none";
    return;
  }
 
  track.innerHTML = "";
  let currentIdx = 0;
 
  prods.forEach((p, i) => {
    const slide = document.createElement("div");
    slide.className = "about-car-slide";
 
    if (isVideo && p.videoUrl) {
      // Video embed
      const embed = getVideoEmbed(p.videoUrl);
      if (embed) {
        slide.innerHTML = `<div class="video-embed-wrap">${embed}</div>`;
      } else {
        // Fallback to image if URL doesn't parse
        slide.innerHTML = `<img src="${p.img || 'Logo.png'}" alt="${p.name || ''}" onerror="this.src='Logo.png'">`;
      }
    } else {
      // Image slide
      slide.innerHTML = `<img src="${p.img || 'Logo.png'}" alt="${p.name || ''}" onerror="this.src='Logo.png'">`;
    }
 
    track.appendChild(slide);
  });
 
  // Build dots
  if (dotsW) {
    prods.forEach((_, i) => {
      const d = document.createElement("div");
      d.className = "about-car-dot" + (i === 0 ? " active" : "");
      d.addEventListener("click", () => goAboutCarousel(currentIdx = i, track, dotsW));
      dotsW.appendChild(d);
    });
  }
 
  // Show/hide nav buttons
  if (prods.length <= 1) {
    if (prevBtn) prevBtn.style.display = "none";
    if (nextBtn) nextBtn.style.display = "none";
  } else {
    if (prevBtn) {
      prevBtn.style.display = "";
      prevBtn.addEventListener("click", () => {
        currentIdx = (currentIdx - 1 + prods.length) % prods.length;
        goAboutCarousel(currentIdx, track, dotsW);
      });
    }
    if (nextBtn) {
      nextBtn.style.display = "";
      nextBtn.addEventListener("click", () => {
        currentIdx = (currentIdx + 1) % prods.length;
        goAboutCarousel(currentIdx, track, dotsW);
      });
    }
 
    // Touch swipe
    const carousel = track.closest(".about-carousel");
    if (carousel) {
      let tsX = 0;
      carousel.addEventListener("touchstart", e => { tsX = e.touches[0].clientX; }, { passive: true });
      carousel.addEventListener("touchend", e => {
        const dx = e.changedTouches[0].clientX - tsX;
        if (Math.abs(dx) > 40) {
          currentIdx = dx < 0
            ? (currentIdx + 1) % prods.length
            : (currentIdx - 1 + prods.length) % prods.length;
          goAboutCarousel(currentIdx, track, dotsW);
        }
      }, { passive: true });
    }
  }
}
 
function goAboutCarousel(idx, track, dotsW) {
  track.style.transform = `translateX(-${idx * 100}%)`;
  if (dotsW) {
    dotsW.querySelectorAll(".about-car-dot").forEach((d, i) => d.classList.toggle("active", i === idx));
  }
}
 
/* ── Video URL parser ──────────────────────────────────────── */
function getVideoEmbed(url) {
  if (!url) return null;
  // YouTube
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\n?#]+)/);
  if (yt) {
    return `<iframe src="https://www.youtube.com/embed/${yt[1]}?rel=0&modestbranding=1"
      frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media;
      gyroscope; picture-in-picture" allowfullscreen title="Development Process"></iframe>`;
  }
  // Vimeo
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) {
    return `<iframe src="https://player.vimeo.com/video/${vm[1]}?title=0&byline=0&portrait=0"
      frameborder="0" allow="autoplay; fullscreen; picture-in-picture"
      allowfullscreen title="Development Process"></iframe>`;
  }
  return null;
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
              : `<a class="cp-buy" href="${p.link}" target="_blank" rel="noopener">Buy Now <i class="fas fa-arrow-right"></i></a>`
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
  lbProducts = prods; lbIndex = startIdx;
  const track = document.getElementById("lb-track");
  const dotsW = document.getElementById("lb-dots");
 
  track.innerHTML = "";
  prods.forEach(p => {
    const slide = document.createElement("div");
    slide.className = "lb-slide";
    slide.innerHTML = `<img src="${p.img || 'Logo.png'}" alt="${p.name}" onerror="this.src='Logo.png'">`;
    track.appendChild(slide);
  });
 
  dotsW.innerHTML = "";
  prods.forEach((_, i) => {
    const d = document.createElement("div");
    d.className = "lb-dot";
    d.addEventListener("click", () => goLightbox(i));
    dotsW.appendChild(d);
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
    buyBtn.style.background = "#9ca3af"; buyBtn.style.pointerEvents = "none"; buyBtn.href = "#";
  } else {
    buyBtn.innerHTML = 'Buy Now <i class="fas fa-arrow-right"></i>';
    buyBtn.style.background = ""; buyBtn.style.pointerEvents = ""; buyBtn.href = p.link || "#";
  }
  document.querySelectorAll("#lb-dots .lb-dot").forEach((d, i) => d.classList.toggle("active", i === idx));
}
 
function closeLightbox() {
  document.getElementById("lightbox").classList.remove("open");
  document.body.style.overflow = "";
}
 
function initLightboxListeners() {
  document.getElementById("lb-close").addEventListener("click", closeLightbox);
  document.getElementById("lb-prev").addEventListener("click", () => {
    if (lbProducts.length > 1) goLightbox((lbIndex - 1 + lbProducts.length) % lbProducts.length);
  });
  document.getElementById("lb-next").addEventListener("click", () => {
    if (lbProducts.length > 1) goLightbox((lbIndex + 1) % lbProducts.length);
  });
  document.addEventListener("keydown", e => {
    const lb = document.getElementById("lightbox");
    if (e.key === "Escape") { if (lb.classList.contains("open")) { closeLightbox(); return; } closeCategoryPage(); return; }
    if (!lb.classList.contains("open") || lbProducts.length <= 1) return;
    if (e.key === "ArrowLeft")  goLightbox((lbIndex - 1 + lbProducts.length) % lbProducts.length);
    if (e.key === "ArrowRight") goLightbox((lbIndex + 1) % lbProducts.length);
  });
  const lb = document.getElementById("lightbox");
  let tsX = 0;
  lb.addEventListener("touchstart", e => { tsX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", e => {
    const dx = e.changedTouches[0].clientX - tsX;
    if (Math.abs(dx) > 40 && lbProducts.length > 1) {
      goLightbox(dx < 0 ? (lbIndex + 1) % lbProducts.length : (lbIndex - 1 + lbProducts.length) % lbProducts.length);
    }
  }, { passive: true });
}
 
/* ══════════════════════════════════════════════════════════════
   SCROLL CUE + NAVBAR + CONTACT
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
  cue.addEventListener("click", () => { document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }); });
}
 
function initNavbarScroll() {
  const nav = document.getElementById("navbar");
  if (!nav) return;
  window.addEventListener("scroll", () => { nav.classList.toggle("scrolled", window.scrollY > 60); }, { passive: true });
}
 
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const origHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    try {
      const res = await fetch("https://formspree.io/f/mwvzlnon", {
        method: "POST", body: new FormData(form),
        headers: { Accept: "application/json" }
      });
      if (res.ok) {
        btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
        btn.style.background = "#16A34A";
        form.reset();
        setTimeout(() => { btn.disabled=false; btn.innerHTML=origHTML; btn.style.background=""; }, 4000);
      } else { throw new Error(); }
    } catch {
      btn.disabled = false; btn.innerHTML = origHTML;
      alert("Something went wrong. Please email DyedForAmerica@Gmail.com directly.");
    }
  });
}
 
function initAboardForm() {
  const form    = document.getElementById("aboardForm");
  const success = document.getElementById("aboard-success");
  if (!form) return;
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const role = form.querySelector('input[name="role"]:checked');
    if (!role) {
      const prompt = form.querySelector(".radio-prompt");
      if (prompt) {
        const orig = prompt.textContent;
        prompt.style.color = "#C41E3A";
        prompt.textContent = "Please select Artist or Affiliate to continue:";
        setTimeout(() => { prompt.style.color=""; prompt.textContent=orig; }, 3500);
      }
      return;
    }
    const btn = document.getElementById("aboard-submit");
    const origHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    try {
      const res = await fetch("https://formspree.io/f/mwvzlnon", {
        method: "POST", body: new FormData(form),
        headers: { Accept: "application/json" }
      });
      if (res.ok) {
        form.style.display = "none";
        success.classList.remove("hidden");
        success.scrollIntoView({ behavior: "smooth", block: "center" });
      } else { throw new Error(); }
    } catch {
      btn.disabled = false; btn.innerHTML = origHTML;
      alert("Something went wrong. Please email DyedForAmerica@Gmail.com directly.");
    }
  });
}
 
