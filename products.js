// products.js

// --- 1. CATEGORY STRIPE PAYMENT LINKS ---
// Each category has a unique Stripe link for streamlined checkout.
const stripeLinks = {
  "shirt": "https://buy.stripe.com/cNi6oHf784L2goUdSgeZ202",
  "pants": "https://buy.stripe.com/eVq7sLaQSdhyc8E8xWeZ203",
  "socks": "https://buy.stripe.com/7sY5kD4sufpGc8E6pOeZ201",
  "tapestry": "https://buy.stripe.com/4gM9AT7EG4L22y49C0eZ204",
  "bedding": "https://buy.stripe.com/14A8wP3oqa5ma0w15ueZ205",
  "hoodie": "https://buy.stripe.com/eVqcN58IK91ifkQ15ueZ207"
};

// --- 2. PRODUCT INVENTORY DATA ---
// The single source of truth for all products displayed on the site.
// 'cat' must match a filter button's 'data-filter' value.
// 'img' must be the exact filename, ending in .jpeg.
const products = [
  { 
    id: "SH-001", 
    name: "Diagonal Rainbow Sweep", 
    price: "25", 
    size: "MED", 
    cat: "shirt", 
    img: "shirt.jpeg", 
    desc: "A classic crewneck tee featuring a vibrant, diagonal burst of color. Perfect for standing out.",
    status: "available" 
  },
  { 
    id: "PA-001", 
    name: "Pastel Galaxy Joggers", 
    price: "45", 
    size: "LG", 
    cat: "pants", 
    img: "pants.jpeg", 
    desc: "Comfortable and stylish joggers with a soft, cosmic blend of pastel tones. Ideal for lounging or adventure.",
    status: "available" 
  },
  { 
    id: "TAP-001", 
    name: "Electric Peace Mandala", 
    price: "75", 
    size: "Giant", 
    cat: "tapestry", 
    img: "tapestry.jpeg", 
    desc: "A massive, electrifying peace sign mandala. The ultimate statement piece for any wall or gathering.",
    status: "available" 
  },
  { 
    id: "SK-001", 
    name: "Watercolor Knee Highs", 
    price: "10", 
    size: "OS", 
    cat: "socks", 
    img: "socks.jpeg", 
    desc: "A subtle wash of watercolor hues on comfortable, durable knee-high socks. One size fits most.",
    status: "available" 
  },
  { 
    id: "BD-001", 
    name: "Sunburst Bedspread Set", 
    price: "300", 
    size: "Queen", 
    cat: "bedding", 
    img: "bedspread.jpeg", 
    desc: "Transform your bedroom with this radiant sunburst design. Includes queen-sized duvet and two pillow shams.",
    status: "available" 
  }
];
