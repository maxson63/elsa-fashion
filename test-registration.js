// Test the exact same request that the frontend would make
fetch('http://localhost:5000/api/ambassadors/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'test-registration@example.com',
    password: 'password123'
  }),
})
.then(response => response.json())
.then(data => {
  console.log('Registration response:', data);
  console.log('SUCCESS: Registration is working!');
})
.catch(error => {
  console.error('Registration error:', error);
  console.log('FAILED: Registration is not working');
});
