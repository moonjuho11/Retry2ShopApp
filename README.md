
# E-Commerce Project

A full-stack e-commerce application built with React + Tailwind CSS (frontend) and Node.js + Express (backend).

## Project Structure

```
├── frontend/                 # React + Tailwind frontend application
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── context/          # React context (state management)
│   │   ├── App.jsx           # Main App component
│   │   ├── main.jsx          # Entry point
│   │   └── index.css         # Global styles
│   ├── index.html            # HTML template
│   ├── package.json
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   └── postcss.config.js     # PostCSS configuration
│
├── backend/                  # Node.js + Express backend API
│   ├── routes/               # API routes
│   ├── data/                 # JSON data files
│   ├── server.js             # Express server entry point
│   └── package.json
│
└── README.md                 # This file
```

## Getting Started

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

## Technologies

- **Frontend**: React, Tailwind CSS, React Router
- **Backend**: Node.js, Express
- **Package Manager**: npm

## Features

- Product catalog
- Product detail pages
- Shopping cart
- Checkout process
- Admin dashboard
- Order management
