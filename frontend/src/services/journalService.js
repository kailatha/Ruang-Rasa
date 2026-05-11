// services/journalService.js
// Base URL — ganti sesuai env kalian
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

// ─── Journal Entries ────────────────────────────────────────────────────────

/** GET /api/journal — ambil semua entri milik user yang login */
export async function getJournalEntries() {
  const res = await fetch(`${BASE_URL}/journal`, {
    headers: { ...getAuthHeader() },
  });
  return handleResponse(res);
}

/** GET /api/journal/:id — ambil satu entri */
export async function getJournalEntry(id) {
  const res = await fetch(`${BASE_URL}/journal/${id}`, {
    headers: { ...getAuthHeader() },
  });
  return handleResponse(res);
}

/**
 * POST /api/journal — buat entri baru
 * Body: { mood, content, tags, sentiment? }
 */
export async function createJournalEntry(payload) {
  const res = await fetch(`${BASE_URL}/journal`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

/**
 * PUT /api/journal/:id — update entri
 * Body: { mood?, content?, tags? }
 */
export async function updateJournalEntry(id, payload) {
  const res = await fetch(`${BASE_URL}/journal/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

/** DELETE /api/journal/:id — hapus entri */
export async function deleteJournalEntry(id) {
  const res = await fetch(`${BASE_URL}/journal/${id}`, {
    method: "DELETE",
    headers: { ...getAuthHeader() },
  });
  return handleResponse(res);
}
