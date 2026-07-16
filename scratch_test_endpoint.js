async function run() {
  try {
    const res = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Привет! Расскажи короткий анекдот про повара.' }],
        ingredients: ['картошка', 'лук'],
        dietaryRestrictions: []
      })
    });
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Response data:', data);
  } catch (err) {
    console.error('Error during fetch:', err);
  }
}

run();
