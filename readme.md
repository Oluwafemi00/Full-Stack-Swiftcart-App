# 🛒 SwiftCart

**A Unified Commerce & Logistics Platform** SwiftCart is a modern, full-stack e-commerce ecosystem designed to seamlessly connect buyers, sellers, and delivery riders in real-time.

![SwiftCart Tech Stack](https://img.shields.io/badge/Stack-PERN-blue)
![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql&logoColor=white)

## Overview

Unlike traditional e-commerce apps that only focus on the shopping experience, SwiftCart handles the entire lifecycle of an order. It features three distinct user portals running on a single, unified database architecture.

### Key Features

**For Buyers (The Shop)**

- **Live Global Search:** Instantly filters products using compound React state (Search Query + Category Filters).
- **Global Cart State:** Built with the React Context API for seamless interactions between the product grid, sliding cart drawer, and navigation badge.
- **Transactional Checkout:** Backend API utilizes strict SQL `BEGIN/COMMIT/ROLLBACK` transactions to ensure inventory is never deducted if a payment step fails.
- **Modern UI/UX:** Glassmorphic sticky navigation, custom CSS toast notifications, and dynamic empty-state fallbacks.

  **For Sellers (The Dashboard)**

- **Real-Time Analytics:** Aggregates live data via SQL `JOIN` operations to calculate "Total Revenue" and "Orders Today" dynamically.
- **Inventory Tracking:** Visual indicators shift automatically based on backend stock levels.

  **For Riders (The Logistics Portal)**

- **Live Order Pool:** Riders can toggle their online status and view a real-time pool of pending orders waiting for pickup.
- **Order Claiming:** One-click acceptance triggers a backend `UPDATE` that assigns the order and removes it from the global available pool to prevent double-booking.

## Tech Stack

- **Frontend:** React.js, React Router DOM, Custom Scoped CSS (Flexbox/Grid/Glassmorphism).
- **Backend:** Node.js, Express.js, CORS.
- **Database:** PostgreSQL (Relational schema with custom ENUM types and cascaded deletions), `pg` node module.
- **Deployment Architecture:** Vercel (Client), Render (API Server), Supabase (Cloud Database).

<!-- ## ⚙️ Local Development Setup

Want to run SwiftCart locally? Follow these steps:

### 1. Clone the repository

```bash
git clone [https://github.com/oluwafemi00/swiftcart.git](https://github.com/oluwafemi00/swiftcart.git)
cd swiftcart
``` -->
