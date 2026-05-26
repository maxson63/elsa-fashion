# Elsa Fashionis - Premium Fashion & Collaboration Platform

A full-featured web application for outfit shopping and creator collaboration, built with React, Node.js, and MongoDB.

## Features

### 🛍️ Shopping Experience
- **30+ Premium Outfits** with detailed product information
- **Multiple Categories**: Casual, Formal, Street Fashion, Luxury, Creative
- **Shopping Cart** with real-time updates
- **Secure Payment Processing** via Stripe
- **Responsive Design** for all devices

### 🤝 Elsa Collab - Creator Collaboration
- **Ambassador Registration** with email/password
- **2-Step Verification** for account security
- **Free Outfit Selection** (3 items per ambassador)
- **Comprehensive Clearance Form** including:
  - Personal details and contact information
  - Social media links and audience size
  - Content type and style preferences
  - Promotion strategy
  - Previous collaborations
  - ID verification
  - Delivery address
- **$2 Clearance Fee** payment processing
- **Dashboard** for managing collaborations

### 💳 Payment System
- **Customer Orders**: Credit/Debit card payments
- **Ambassador Clearance**: Card or PayPal options
- **Secure Data Storage** on server
- **Order Management** system

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Hook Form** for forms
- **Axios** for API calls
- **React Hot Toast** for notifications
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Stripe** for payments
- **bcryptjs** for password hashing
- **Helmet** for security
- **Rate Limiting** for API protection

## Project Structure

```
elsa-fashionis/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── contexts/        # React contexts (Cart, Auth)
│   │   ├── pages/           # Page components
│   │   └── App.tsx          # Main app component
│   ├── public/              # Static assets
│   └── package.json
├── server/                  # Node.js backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── seed.js             # Database seeding
│   └── index.js            # Server entry point
├── .env                    # Environment variables
├── package.json            # Root package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd elsa-fashionis

# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..

# Install backend dependencies
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/elsa-fashionis

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Email Configuration (for 2FA)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Client URL
CLIENT_URL=http://localhost:3000
```

### 3. Database Setup

Make sure MongoDB is running, then seed the database with sample products:

```bash
# Seed the database with 30 products
node server/seed.js
```

### 4. Start the Application

```bash
# Start both frontend and backend concurrently
npm run dev

# Or start separately:
# Backend only
npm run server

# Frontend only (in another terminal)
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Ambassadors
- `POST /api/ambassadors/register` - Register ambassador
- `POST /api/ambassadors/login` - Login ambassador
- `GET /api/ambassadors/profile` - Get ambassador profile
- `PUT /api/ambassadors/profile` - Update profile
- `POST /api/ambassadors/select-outfits` - Select 3 outfits
- `POST /api/ambassadors/submit-clearance` - Submit clearance

### Payments
- `POST /api/payments/create-payment-intent` - Create customer payment
- `POST /api/payments/clearance-payment` - Process clearance fee
- `POST /api/payments/confirm-payment` - Confirm payment

### Orders
- `GET /api/orders` - Get all orders (admin)
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status

## Key Features Implementation

### Shopping Cart System
- Real-time cart updates with React Context
- Item quantity management
- Price calculations
- Persistent cart during session

### Ambassador System
- Secure authentication with JWT
- Profile management
- Outfit selection (limited to 3 items)
- Clearance form with comprehensive validation
- Payment processing for clearance fee

### Payment Integration
- Stripe integration for secure payments
- Support for credit/debit cards
- Payment intent creation and confirmation
- Webhook handling for payment events

### Security Features
- Password hashing with bcryptjs
- JWT token authentication
- Rate limiting on API endpoints
- Helmet for security headers
- Input validation and sanitization

## Development Notes

### Styling
- Uses Tailwind CSS for utility-first styling
- Custom CSS variables for consistent theming
- Responsive design with mobile-first approach
- Component-based styling with reusable classes

### State Management
- React Context for cart and authentication state
- Local state for component-specific data
- Server state managed through API calls

### Database Schema
- **Products**: Name, description, price, category, sizes, colors, images
- **Ambassadors**: Profile info, clearance status, selected outfits, balance
- **Orders**: Customer info, items, shipping, payment details

## Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend: `cd frontend && npm run build`
2. Deploy the `build` folder to your hosting platform
3. Update environment variables for production

### Backend (Heroku/Railway)
1. Deploy the server directory
2. Configure production environment variables
3. Set up MongoDB Atlas for production database
4. Configure Stripe webhook endpoints

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please contact the development team.

---

**Elsa Fashionis** - Where Fashion Meets Collaboration 🚀
