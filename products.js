// --- STRIPE LINKS ---
const stripeLinks = {
  "10": "https://buy.stripe.com/7sY5kD4sufpGc8E6pOeZ201",
  "25": "https://buy.stripe.com/cNi6oHf784L2goUdSgeZ202",
  "45": "https://buy.stripe.com/eVq7sLaQSdhyc8E8xWeZ203",
  "55": "https://buy.stripe.com/eVqcN58IK91ifkQ15ueZ207",
  "75": "https://buy.stripe.com/4gM9AT7EG4L22y49C0eZ204",
  "300": "https://buy.stripe.com/14A8wP3oqa5ma0w15ueZ205"
};

// --- PRODUCT INVENTORY ---
const products = [
  { 
    id: "SH-01", 
    name: "Classic Spiral Tee", 
    price: "25", 
    size: "MED", 
    cat: "shirt", // Matches HTML data-filter="shirt"
    img: "shirt.jpeg", 
    status: "available" 
  },
  { 
    id: "PA-01", 
    name: "Galaxy Joggers", 
    price: "45", 
    size: "LG", 
    cat: "pants", // Matches HTML data-filter="pants"
    img: "pants.jpeg", 
    status: "available" 
  },
  { 
    id: "SK-01", 
    name: "Watercolor Knee Socks", 
    price: "10", 
    size: "OS", 
    cat: "socks", // Matches HTML data-filter="socks"
    img: "socks.jpeg", 
    status: "available" 
  },
  { 
    id: "TAP-01", 
    name: "Mandala Wall Hanging", 
    price: "75", 
    size: "XL", 
    cat: "tapestry", // Matches HTML data-filter="tapestry"
    img: "tapestry.jpeg", 
    status: "available" 
  },
  { 
    id: "BD-01", 
    name: "Sunburst Bedspread Set", 
    price: "300", 
    size: "Queen", 
    cat: "bedding", // Matches HTML data-filter="bedding"
    img: "bedspread.jpeg", 
    status: "available" 
  }
];
