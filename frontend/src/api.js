const BASE_URL = "http://localhost:3000";

export async function post(endpoint, body) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  let data;
  try {
    data = await res.json();
  } catch {
    throw { error: "Invalid response from server" };
  }

  if (!res.ok) throw data;
  return data;
}
