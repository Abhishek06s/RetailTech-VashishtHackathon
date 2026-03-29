# DealDrop - RetailTech Project

## Overview

DealsHub: Hyperlocal Flash Sale Platform

Local retailers often face challenges in clearing overstocked or near-expiry inventory due to limited digital presence and visibility. At the same time, nearby customers remain unaware of these time-sensitive deals, missing out on potential savings. The lack of effective discovery platforms further widens the gap between supply and demand at a hyperlocal level.

This disconnect results in lost revenue opportunities for retailers and reduced access to affordable products for customers. The absence of a system that enables real-time, location-based deal discovery highlights the need for a solution that connects local businesses with nearby consumers in a timely and efficient manner.

## Features

- **User Authentication**: Secure login and signup using Firebase Authentication.
- **Product Deals**: Browse and discover deals from various vendors.
- **Shopping Cart**: Add items to cart, manage quantities, and proceed to checkout.
- **Vendor Dashboard**: Vendors can manage their products and deals.
- **Location-Based Search**: Find deals based on user location.
- **Search Functionality**: Search for products and deals across the platform.
- **Toast Notifications**: Real-time feedback for user actions.
- **Responsive Design**: Optimized for desktop and mobile devices.

## Tech Stack

### Frontend
- **React**: JavaScript library for building user interfaces.
- **Vite**: Fast build tool and development server.
- **React Router DOM**: Declarative routing for React applications.
- **Lucide React**: Beautiful & consistent icon toolkit.
- **CSS**: Custom styling for components.

### Backend & Database
- **Firebase**: Comprehensive backend-as-a-service platform.
  - **Firebase Authentication**: For user authentication.
  - **Firestore**: NoSQL cloud database for real-time data storage.
  - **Firebase Hosting**: For deploying the application (optional).

### APIs & Libraries
- **Firebase SDK**: Official SDK for integrating Firebase services (Authentication, Firestore).
- **React Context API**: For state management (Auth, Cart, Location, Search, Toast contexts).
- **IP-API**: `https://ipapi.co/json/` - For IP-based geolocation fallback to determine user location.
- **Nominatim API**: `https://nominatim.openstreetmap.org/reverse` - For reverse geocoding to get city names from latitude and longitude.

### Development Tools
- **ESLint**: Linting utility for JavaScript and JSX.
- **Vite Plugin React**: Official React plugin for Vite.

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/HemanthrajM06/RetailTech-Project.git
   cd RetailTech-Project
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Firebase**:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Enable Authentication and Firestore.
   - Update `src/firebase.js` with your Firebase configuration.

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```

5. **Build for Production**:
   ```bash
   npm run build
   npm run preview
   ```

## Usage

- **Development**: Run `npm run dev` to start the development server.
- **Linting**: Run `npm run lint` to check for code quality issues.
- **Building**: Run `npm run build` to create a production build.

## Project Structure

```
RetailTech-Project/
├── public/                 # Static assets
├── src/
│   ├── assets/             # Images and other assets
│   ├── components/         # Reusable UI components (e.g., Navbar)
│   ├── context/            # React contexts for state management
│   ├── pages/              # Page components (e.g., Login, Cart, Deals)
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   └── firebase.js         # Firebase configuration
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── eslint.config.js        # ESLint configuration
└── README.md               # This file
```

## Contributing

1. Fork the repository.
2. Create a new branch for your feature: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Firebase](https://firebase.google.com/) for backend services.
- [React](https://reactjs.org/) for the frontend framework.
- [Vite](https://vitejs.dev/) for the build tool.
- [Lucide](https://lucide.dev/) for icons.
