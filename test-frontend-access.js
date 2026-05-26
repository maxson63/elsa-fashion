const http = require('http');

// Test if frontend is accessible
const testFrontend = () => {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`Frontend test - Status: ${res.statusCode}`);
    console.log(`Frontend is accessible: ${res.statusCode === 200 ? 'YES' : 'NO'}`);
    
    res.setEncoding('utf8');
    let body = '';
    res.on('data', (chunk) => {
      body += chunk;
    });
    res.on('end', () => {
      console.log(`Frontend response length: ${body.length} characters`);
    });
  });

  req.on('error', (e) => {
    console.error(`Frontend access error: ${e.message}`);
    console.log('Frontend is NOT accessible');
  });

  req.end();
};

// Test if backend is accessible
const testBackend = () => {
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/ambassadors/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const data = JSON.stringify({
    email: 'connection-test@example.com',
    password: 'password123'
  });

  const req = http.request(options, (res) => {
    console.log(`Backend test - Status: ${res.statusCode}`);
    console.log(`Backend is accessible: ${res.statusCode === 201 ? 'YES' : 'NO'}`);
    
    res.setEncoding('utf8');
    let body = '';
    res.on('data', (chunk) => {
      body += chunk;
    });
    res.on('end', () => {
      console.log(`Backend response: ${body.substring(0, 100)}...`);
    });
  });

  req.on('error', (e) => {
    console.error(`Backend access error: ${e.message}`);
    console.log('Backend is NOT accessible');
  });

  req.write(data);
  req.end();
};

console.log('Testing frontend and backend accessibility...');
testFrontend();
setTimeout(testBackend, 1000);
