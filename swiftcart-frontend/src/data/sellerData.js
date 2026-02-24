// src/data/sellerData.js

export const sellerStats = [
  {
    id: 1,
    label: "Total Revenue",
    value: "₦120,450",
    trend: "+12% from last week",
  },
  { id: 2, label: "Orders Today", value: "24", trend: "+5 from last week" },
  { id: 3, label: "Products Listed", value: "48", trend: "+2 from last week" },
  { id: 4, label: "Growth", value: "18%", trend: "+3% from last week" },
];

// Notice the "status" field: we'll use this to dynamically assign your CSS classes!
export const inventory = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    price: "15,000",
    stock: 25,
    status: "good",
    rating: "4.8/5",
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    price: "30,000",
    stock: 18,
    status: "low",
    rating: "4.6/5",
  },
  {
    id: 3,
    name: "Organic Coffee Beans",
    price: "25,000",
    stock: 50,
    status: "good",
    rating: "4.9/5",
  },
  {
    id: 4,
    name: "Minimalist Leather Wallet",
    price: "10,000",
    stock: 35,
    status: "good",
    rating: "4.7/5",
  },
  {
    id: 5,
    name: "Portable Power Bank",
    price: "5,000",
    stock: 42,
    status: "good",
    rating: "4.5/5",
  },
];
