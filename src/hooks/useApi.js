export async function sendNotificationApi(to, text) {
  try {
    const res = await fetch('https://httpbin.org/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, text })
    });
    return res.ok ? await res.json() : Promise.reject(new Error('api_error'));
  } catch (err) {
    return Promise.reject(err);
  }
}
