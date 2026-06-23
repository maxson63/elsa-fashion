const https = require('https');

// Bag product names to update
const bagProductNames = [
  "Elegant Women's Designer Handbag",
  "Chic Women's Tote Bag",
  "Classic Women's Leather Satchel",
  "Trendy Women's Crossbody Bag",
  "Luxury Women's Clutch Bag",
  "Casual Women's Shoulder Bag",
  "Professional Men's Briefcase",
  "Casual Men's Messenger Bag",
  "Stylish Men's Backpack",
  "Luxury Men's Leather Duffle Bag"
];

const postData = JSON.stringify({
  productNames: bagProductNames,
  newCategory: 'bags'
});

const options = {
  hostname: 'elsa-fashion-backend.onrender.com',
  port: 443,
  path: '/api/products/update-category',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      if (res.statusCode === 200) {
        console.log('✅ Successfully updated bag products to use bags category!');
        console.log(response.message);
      } else {
        console.error('❌ Error updating products:', response.message);
        if (response.error) console.error('Error details:', response.error);
      }
    } catch (error) {
      console.error('❌ Error parsing response:', error.message);
      console.error('Response data:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error calling API:', error.message);
});

req.write(postData);
req.end();
