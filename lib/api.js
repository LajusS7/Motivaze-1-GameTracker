export const TOKEN_KEY = "gt_token";
export const USER_KEY = "gt_user";

export async function api(path, { method = "GET", body, headers = {} } = {}) {
  const token = localStorage.getItem(TOKEN_KEY);

  const res = await fetch(path, {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
  }

  if (!res.ok) {

    if (res.status === 401 && token) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      window.dispatchEvent(new Event("auth:unauthorized"));
    }
    const err = new Error(data?.message || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }

  return data;
}
