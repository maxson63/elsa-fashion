const http = require('http');

// Test if backend is accessible from frontend
const testBackendConnection = () => {
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/ambassadors/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  };

  const data = JSON.stringify({
    email: 'frontend-test@example.com',
    password: 'password123'
  });

  const req = http.request(options, (res) => {
    console.log(`Backend connection test - Status: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers)}`);
    
    res.setEncoding('utf8');
    let body = '';
    res.on('data', (chunk) => {
      body += chunk;
    });
    res.on('end', () => {
      console.log(`Response: ${body}`);
      console.log('Backend is accessible!');
    });
  });

  req.on('error', (e) => {
    console.error(`Backend connection error: ${e.message}`);
  });

  req.write(data);
  req.end();
};

testBackendConnection();
