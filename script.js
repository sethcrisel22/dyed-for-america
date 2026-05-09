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
                <div class="product-image-wrapper">
                    <img src="${product.img}" alt="${product.name}" style="width: 100%; height: auto; border-radius: 8px;">
                </div>
                <div class="product-details" style="padding: 15px 0;">
                    <h3 style="margin: 0 0 10px 0;">${product.name}</h3>
                    <p style="font-size: 0.9rem; color: #555; margin-bottom: 15px;">${product.desc}</p>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <strong>$${product.price}</strong>
                        <span style="font-size: 0.85rem; background: #eee; padding: 4px 8px; border-radius: 4px;">Size: ${product.size}</span>
                    </div>
                    <button style="width: 100%; margin-top: 15px; padding: 10px; background: #222; color: #fff; border: none; border-radius: 5px; cursor: pointer;">
                        Add to Cart
                    </button>
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
