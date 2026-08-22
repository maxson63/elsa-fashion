const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Load Google OAuth credentials from environment variables
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'your-google-client-id';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'your-google-client-secret';
const CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback';

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Find or create ambassador based on Google profile
    const Ambassador = require('../models/Ambassador');
    
    let ambassador = await Ambassador.findOne({ email: profile.emails[0].value });
    
    if (ambassador) {
      // User exists, ensure they're verified (Google users are pre-verified)
      if (!ambassador.isVerified) {
        ambassador.isVerified = true;
        await ambassador.save();
      }
      return done(null, ambassador);
    } else {
      // Create new ambassador
      ambassador = new Ambassador({
        email: profile.emails[0].value,
        password: 'google-oauth-' + Date.now(), // Placeholder password
        isVerified: true, // Google accounts are pre-verified
        balance: 0,
        clearanceStatus: 'pending',
        clearancePaymentStatus: 'pending',
        profile: {
          fullName: profile.displayName || '',
          emailAddress: profile.emails[0].value
        },
        selectedOutfits: [],
        createdAt: new Date()
      });
      
      await ambassador.save();
      return done(null, ambassador);
    }
  } catch (error) {
    return done(error, null);
  }
}));

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const Ambassador = require('../models/Ambassador');
    const ambassador = await Ambassador.findById(id);
    done(null, ambassador);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
