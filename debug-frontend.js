// Test if we can reach the backend from different scenarios
const testConnection = async () => {
  console.log('Testing backend connection from frontend perspective...');
  
  try {
    const response = await fetch('http://localhost:5000/api/ambassadors/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3000'
      },
      body: JSON.stringify({
        email: 'debug-test@example.com',
        password: 'password123'
      })
    });
    
    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);
    console.log('SUCCESS: Frontend can reach backend!');
    
  } catch (error) {
    console.error('ERROR: Frontend cannot reach backend:', error.message);
    console.log('This might be a CORS or network issue');
  }
};

testConnection();
