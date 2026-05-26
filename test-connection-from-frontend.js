// Test the exact same request that the frontend would make
const testConnection = async () => {
  console.log('Testing connection from frontend perspective...');
  
  try {
    const response = await fetch('http://localhost:5000/api/ambassadors/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'http://localhost:3000'
      },
      body: JSON.stringify({
        email: 'frontend-connection-test@example.com',
        password: 'password123'
      }),
      mode: 'cors'
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Request failed:', errorData);
      return false;
    }

    const data = await response.json();
    console.log('Request successful:', data);
    return true;
    
  } catch (error) {
    console.error('Connection failed:', error);
    return false;
  }
};

testConnection().then(success => {
  if (success) {
    console.log('SUCCESS: Frontend can connect to backend');
  } else {
    console.log('FAILED: Frontend cannot connect to backend');
  }
});
