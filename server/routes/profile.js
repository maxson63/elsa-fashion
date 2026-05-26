const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

// Create profile pictures directory if it doesn't exist
const PROFILE_PICTURES_DIR = path.join(__dirname, '../data/profile-pictures');

// Save profile picture
router.post('/upload', async (req, res) => {
  try {
    const { ambassadorId, profilePicture } = req.body;
    
    if (!ambassadorId || !profilePicture) {
      return res.status(400).json({ message: 'Missing required fields: ambassadorId, profilePicture' });
    }

    // Create profile pictures directory if it doesn't exist
    await fs.mkdir(PROFILE_PICTURES_DIR, { recursive: true });

    // Save profile picture data
    const profileData = {
      ambassadorId,
      profilePicture,
      updatedAt: new Date().toISOString()
    };

    const profileFilePath = path.join(PROFILE_PICTURES_DIR, `${ambassadorId}.json`);
    await fs.writeFile(profileFilePath, JSON.stringify(profileData, null, 2));

    console.log(`Profile picture saved for ambassador: ${ambassadorId}`);

    res.json({
      message: 'Profile picture saved successfully',
      profilePicture
    });

  } catch (error) {
    console.error('Error saving profile picture:', error);
    res.status(500).json({ 
      message: 'Error saving profile picture', 
      error: error.message 
    });
  }
});

// Get profile picture
router.get('/:ambassadorId', async (req, res) => {
  try {
    const { ambassadorId } = req.params;
    
    if (!ambassadorId) {
      return res.status(400).json({ message: 'Missing ambassadorId' });
    }

    const profileFilePath = path.join(PROFILE_PICTURES_DIR, `${ambassadorId}.json`);
    
    try {
      const profileData = await fs.readFile(profileFilePath, 'utf8');
      const profile = JSON.parse(profileData);
      
      res.json({
        profilePicture: profile.profilePicture,
        updatedAt: profile.updatedAt
      });
    } catch (err) {
      // File doesn't exist, return null
      res.json({
        profilePicture: null,
        updatedAt: null
      });
    }

  } catch (error) {
    console.error('Error fetching profile picture:', error);
    res.status(500).json({ 
      message: 'Error fetching profile picture', 
      error: error.message 
    });
  }
});

// Delete profile picture
router.delete('/:ambassadorId', async (req, res) => {
  try {
    const { ambassadorId } = req.params;
    
    if (!ambassadorId) {
      return res.status(400).json({ message: 'Missing ambassadorId' });
    }

    const profileFilePath = path.join(PROFILE_PICTURES_DIR, `${ambassadorId}.json`);
    
    try {
      await fs.unlink(profileFilePath);
      console.log(`Profile picture deleted for ambassador: ${ambassadorId}`);
      
      res.json({
        message: 'Profile picture deleted successfully'
      });
    } catch (err) {
      // File doesn't exist, that's fine
      res.json({
        message: 'Profile picture deleted successfully'
      });
    }

  } catch (error) {
    console.error('Error deleting profile picture:', error);
    res.status(500).json({ 
      message: 'Error deleting profile picture', 
      error: error.message 
    });
  }
});

module.exports = router;
