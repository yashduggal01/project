// Utility for making API calls to the backend
export async function apiRequest(path, method = 'POST', data) {
  const res = await fetch(`http://localhost:5000/api/${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'API Error');
  return result;
}
