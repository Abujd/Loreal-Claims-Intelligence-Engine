const BASE_URL = "http://localhost:3001/api";

async function request(path, options) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(body?.message || `Request failed (${res.status})`);
  }
  return body;
}

export function listClaims() {
  return request("/claims");
}

export function assessEvidence({ claimId, market, evidence }) {
  return request("/assess", {
    method: "POST",
    body: JSON.stringify({ claimId, market, evidence }),
  });
}
