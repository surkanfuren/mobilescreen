import { getToken } from "./auth.js";
import { API_URL as BASE_URL } from "./config.js";

/**
 * Makes an authenticated request to a CLI Firebase Function.
 * Reads the stored JWT token and attaches it as a Bearer header.
 *
 * @param {string} path - Function name, e.g. "me" or "get_projects"
 * @param {RequestInit} options - fetch options (method, body, etc.)
 */
export async function apiFetch(path, options = {}) {
  const token = getToken();

  if (!token) {
    console.error('Not logged in. Run "mobilescreen login" first.');
    process.exit(1);
  }

  const res = await fetch(`${BASE_URL}/${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    console.error('Session expired. Run "mobilescreen login" to re-authenticate.');
    process.exit(1);
  }

  return res;
}
