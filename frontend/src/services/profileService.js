// services/profileService.js
// Service layer untuk Profile API — mengikuti pola journalService.js

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

// ─── Profile ────────────────────────────────────────────────────────────────

/** GET /api/profile — ambil data profil user yang login */
export async function getProfile() {
  const res = await fetch(`${BASE_URL}/profile`, {
    headers: { ...getAuthHeader() },
  });
  return handleResponse(res);
}

/** PUT /api/profile — update data profil */
export async function updateProfile(payload) {
  const res = await fetch(`${BASE_URL}/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

/** PUT /api/change-password — ganti password */
export async function changePassword(payload) {
  const res = await fetch(`${BASE_URL}/change-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

/** GET /api/profile/stats — ambil statistik (jumlah skrining & jurnal) */
export async function getProfileStats() {
  const res = await fetch(`${BASE_URL}/profile/stats`, {
    headers: { ...getAuthHeader() },
  });
  return handleResponse(res);
}
