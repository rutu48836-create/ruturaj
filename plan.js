const CLIENT_ID = 'AbAUOZEXXFLh9xqM986-A0YDkMbGbaXjSyyfYsf2Y-F8EfZJerrU9bMKMvivpZpZhrM2EYIQSdYiqbR9';
const SECRET = 'EJVcKTZwrh5h6f2KOpbNxRUeHM7hTqQAbpxrHqulE3etRdOLfeod-yeNmgAp5mgZHk861vJAUiuVXke0';

async function checkCredentials() {
  const credentials = Buffer.from(`${CLIENT_ID}:${SECRET}`).toString('base64');

  const response = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();

  if (response.ok) {
    console.log('✅ Credentials valid!');
    console.log('Access Token:', data.access_token);
    console.log('Expires in:', data.expires_in, 'seconds');
    console.log('App ID:', data.app_id);
  } else {
    console.error('❌ Credentials invalid:', data.error_description);
  }
}

checkCredentials();