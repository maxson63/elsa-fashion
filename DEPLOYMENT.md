# Deployment Guide - Elsa Fashion

This guide will help you deploy your full-stack application to production.

## Architecture
- **Frontend**: React app deployed to Vercel
- **Backend**: Node.js/Express API deployed to Render/Railway/Heroku
- **Database**: MongoDB Atlas

---

## Step 1: Deploy Backend (Choose One Platform)

### Option A: Deploy to Render (Recommended)

1. **Create a Render account**
   - Go to https://render.com and sign up

2. **Prepare your code**
   - Make sure your code is pushed to GitHub
   - Ensure `server/index.js` is the entry point
   - Add this to your root `package.json` if not present:
   ```json
   "scripts": {
     "start": "node server/index.js"
   }
   ```

3. **Create MongoDB Atlas database**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create a free cluster
   - Create a database user with read/write permissions
   - Get your connection string (format: `mongodb+srv://<username>:<password>@cluster.mongodb.net/elsa-fashion?retryWrites=true&w=majority`)

4. **Deploy on Render**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: elsa-fashion-backend
     - **Root Directory**: `.` (root)
     - **Build Command**: `npm install`
     - **Start Command**: `node server/index.js`
   - Add Environment Variables:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: Generate a random secret key (use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
     - `PORT`: 5000
     - `NODE_ENV`: production
     - `STRIPE_SECRET_KEY`: Your Stripe secret key
     - `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
     - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
     - `CLOUDINARY_API_KEY`: Your Cloudinary API key
     - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
   - Click "Deploy Web Service"

5. **Get your backend URL**
   - After deployment, Render will give you a URL like: `https://elsa-fashion-backend.onrender.com`
   - Copy this URL for the next steps

### Option B: Deploy to Railway

1. **Create a Railway account**
   - Go to https://railway.app and sign up

2. **Deploy your backend**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will automatically detect it's a Node.js project
   - Add environment variables in the "Variables" tab:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: Generate a random secret key
     - `PORT`: 5000
     - `NODE_ENV`: production
     - `STRIPE_SECRET_KEY`: Your Stripe secret key
     - `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
     - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
     - `CLOUDINARY_API_KEY`: Your Cloudinary API key
     - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
   - Click "Deploy"

3. **Get your backend URL**
   - Railway will provide a URL like: `https://your-app.railway.app`
   - Copy this URL

### Option C: Deploy to Heroku

1. **Install Heroku CLI**
   - Download from https://devcenter.heroku.com/articles/heroku-cli

2. **Create a Procfile**
   - Create a file named `Procfile` in the root directory:
   ```
   web: node server/index.js
   ```

3. **Login and deploy**
   ```bash
   heroku login
   heroku create elsa-fashion-backend
   git push heroku main
   ```

4. **Set environment variables**
   ```bash
   heroku config:set MONGODB_URI="your-mongodb-uri"
   heroku config:set JWT_SECRET="your-secret-key"
   heroku config:set PORT=5000
   heroku config:set NODE_ENV=production
   heroku config:set STRIPE_SECRET_KEY="your-stripe-secret"
   heroku config:set STRIPE_PUBLISHABLE_KEY="your-stripe-publishable"
   heroku config:set CLOUDINARY_CLOUD_NAME="your-cloud-name"
   heroku config:set CLOUDINARY_API_KEY="your-api-key"
   heroku config:set CLOUDINARY_API_SECRET="your-api-secret"
   ```

5. **Get your backend URL**
   - Your app will be available at: `https://elsa-fashion-backend.herokuapp.com`

---

## Step 2: Update Frontend Environment

1. **Edit `frontend/.env.production`**
   - Replace the placeholder URL with your actual backend URL:
   ```
   REACT_APP_API_URL=https://your-backend-url.com
   ```
   - Example with Render:
   ```
   REACT_APP_API_URL=https://elsa-fashion-backend.onrender.com
   ```

2. **Commit the changes**
   ```bash
   git add frontend/.env.production
   git commit -m "Add production API URL"
   git push
   ```

---

## Step 3: Deploy Frontend to Vercel

1. **Create a Vercel account**
   - Go to https://vercel.com and sign up

2. **Import your repository**
   - Click "Add New Project"
   - Import your GitHub repository

3. **Configure the project**
   - **Framework Preset**: Create React App
   - **Root Directory**: `./`
   - **Build Command**: `cd frontend && npm run build`
   - **Output Directory**: `frontend/build`
   - **Install Command**: `cd frontend && npm install`

4. **Add environment variables**
   - In "Environment Variables", add:
     - `REACT_APP_API_URL`: Your backend URL (same as in .env.production)
   - Example: `https://elsa-fashion-backend.onrender.com`

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Vercel will give you a URL like: `https://elsa-fashion.vercel.app`

---

## Step 4: Verify Deployment

1. **Test the backend**
   - Visit your backend URL + `/api/products`
   - Example: `https://elsa-fashion-backend.onrender.com/api/products`
   - You should see a JSON response with products

2. **Test the frontend**
   - Visit your Vercel URL
   - Try browsing products, adding to cart
   - Test ambassador registration/login

3. **Check CORS**
   - Your backend already has CORS configured for Vercel domains
   - If you see CORS errors, update `server/index.js` line 31:
   ```javascript
   origin: ['http://localhost:3000', 'https://your-vercel-app.vercel.app'],
   ```

---

## Environment Variables Reference

### Backend (Required)
- `MONGODB_URI`: MongoDB Atlas connection string
- `JWT_SECRET`: Random secret key for JWT tokens
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Set to "production"

### Backend (Optional - for features)
- `STRIPE_SECRET_KEY`: Stripe secret key for payments
- `STRIPE_PUBLISHABLE_KEY`: Stripe publishable key
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret

### Frontend (Required)
- `REACT_APP_API_URL`: Your deployed backend URL

---

## Troubleshooting

### Backend deployment fails
- Check that `server/index.js` exists and is valid
- Verify all environment variables are set
- Check Render/Railway/Heroku logs for errors

### Frontend can't connect to backend
- Verify `REACT_APP_API_URL` is correct
- Check backend is running and accessible
- Ensure CORS is configured for your domain
- Check browser console for CORS errors

### Build fails on Vercel
- Ensure `frontend/package.json` has correct scripts
- Check that all dependencies are in `package.json`
- Verify build command works locally: `cd frontend && npm run build`

### MongoDB connection errors
- Verify IP whitelist in MongoDB Atlas includes 0.0.0.0/0
- Check username/password in connection string
- Ensure database user has correct permissions

---

## Post-Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] API endpoints working
- [ ] User registration/login working
- [ ] Ambassador features working
- [ ] Payment integration tested (if using Stripe)
- [ ] Database operations working
- [ ] CORS properly configured
- [ ] Environment variables secured
- [ ] SSL/HTTPS enabled (automatic on Vercel/Render/Railway)

---

## Cost Estimates

### Free Tier Options
- **Vercel**: Free for personal projects
- **Render**: Free tier available (with spin-up delay)
- **Railway**: $5 free credit monthly
- **MongoDB Atlas**: Free tier (512MB storage)

### Recommended for Production
- Consider upgrading to paid tiers for:
  - Better performance
  - No spin-up delays
  - More storage
  - Priority support

---

## Security Notes

1. **Never commit `.env` files** to Git
2. **Use strong JWT secrets** in production
3. **Enable MongoDB authentication**
4. **Use HTTPS everywhere** (automatic on these platforms)
5. **Rotate API keys periodically**
6. **Monitor logs for suspicious activity**
7. **Set up rate limiting** (already configured in your backend)
8. **Keep dependencies updated**

---

## Support

If you encounter issues:
- Check platform-specific documentation
- Review deployment logs
- Test API endpoints individually
- Verify environment variables
- Check CORS configuration
