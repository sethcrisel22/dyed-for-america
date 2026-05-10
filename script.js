// script.js
// This file handles the logic, formatting, and interactivity of the website.

document.addEventListener("DOMContentLoaded", () => {
    // 1. Grab the elements we need from the HTML
    const productGrid = document.getElementById("product-grid");
    const filterBtns = document.querySelectorAll(".filter-btn");

    // 2. Function to display products on the page
    function renderProducts(filterCategory = "all") {
        // Clear the "Loading Products..." text or any existing products
        productGrid.innerHTML = ""; 
        
        // Filter the products based on the button clicked
        const filteredProducts = products.filter(product => 
            filterCategory === "all" || product.cat === filterCategory
        );

        // If a category is empty, show a friendly message
        if (filteredProducts.length === 0) {
            productGrid.innerHTML = "<p style='grid-column: 1 / -1; text-align: center;'>More items coming soon to this category!</p>";
            return;
        }

        // Create a card for each product and add it to the grid
        filteredProducts.forEach(product => {
            const card = document.createElement("div");
            card.className = "product-card";
            
            card.innerHTML = `
                <div class="product-img-wrap">
                    <img src="${product.img}" alt="${product.name}">
                    <div class="product-badge sz">Size: ${product.size}</div>
                </div>
                <div class="product-info">
                    <div class="product-cat">${product.cat}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-desc">${product.desc}</p>
                    <div class="product-foot">
                        <div class="product-price">$${product.price}</div>
                        <a href="${product.link}" class="buy-btn" target="_blank" rel="noopener noreferrer">
                            Buy Now <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
            `;
            productGrid.appendChild(card);
        });
    }

    // 3. Load all products when the page first opens
    if (typeof products !== "undefined") {
        renderProducts("all");
    } else {
        productGrid.innerHTML = "<p style='grid-column: 1 / -1; text-align: center;'>Error loading product data. Please check products.js.</p>";
    }

    // 4. Make the filter buttons interactive
    filterBtns.forEach(btn => {
        btn.addEventListener("click", (event) => {
            // Remove the 'active' styling from all buttons
            filterBtns.forEach(b => b.classList.remove("active"));
            
            // Add 'active' styling to the button that was just clicked
            event.target.classList.add("active");
            
            // Get the category name from the button's data-filter attribute and re-render
            const filterValue = event.target.getAttribute("data-filter");
            renderProducts(filterValue);
        });
    });

    // 5. Handle the Contact Form Submission
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault(); // Prevents the page from refreshing
            alert("Thank you for your message! We will get back to you soon.");
            contactForm.reset(); // Clears the form fields
        });
    }
});
