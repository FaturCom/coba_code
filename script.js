function getApiBase() {
  const url = new URL(window.location.href);
  const apiFromQuery = url.searchParams.get("api");
  if (apiFromQuery) return apiFromQuery.replace(/\/+$/, "");

  const fallback = "https://coba-code.vercel.app";

  if (url.protocol !== "http:" && url.protocol !== "https:") return fallback;

  const host = url.hostname.toLowerCase();
  if (host === "localhost" || host === "127.0.0.1" || host === "0.0.0.0") return fallback;
  if (host.endsWith(".github.io")) return fallback;

  return url.origin.replace(/\/+$/, "");
}

const API_BASE = getApiBase();
const API_BASE_API = API_BASE.endsWith("/api") ? API_BASE : `${API_BASE}/api`;

const btnHelloWorld = document.getElementById("btnHelloWorld");
const helloForm = document.getElementById("helloForm");
const nameInput = document.getElementById("nameInput");
const btnSubmitHello = document.getElementById("btnSubmitHello");
const resultEl = document.getElementById("result");

function setResult(text) {
  resultEl.textContent = text;
}

function setBusy(isBusy) {
  btnHelloWorld.disabled = isBusy;
  btnSubmitHello.disabled = isBusy;
}

async function fetchJson(path, options) {
  const attempt = async (base) => {
    const res = await fetch(`${base}${path}`, options);
    const contentType = res.headers.get("content-type") || "";
    const body = contentType.includes("application/json") ? await res.json() : await res.text();
    return { res, body };
  };

  const first = await attempt(API_BASE);
  if (first.res.ok) return first.body;

  if (first.res.status === 404 || first.res.status === 405) {
    const second = await attempt(API_BASE_API);
    if (second.res.ok) return second.body;
    const detail = typeof second.body === "string" ? second.body : JSON.stringify(second.body);
    throw new Error(`HTTP ${second.res.status}: ${detail}`);
  }

  const detail = typeof first.body === "string" ? first.body : JSON.stringify(first.body);
  throw new Error(`HTTP ${first.res.status}: ${detail}`);
}

btnHelloWorld.addEventListener("click", async () => {
  setBusy(true);
  try {
    const data = await fetchJson("/", { method: "GET" });
    setResult(data?.status ?? JSON.stringify(data));
  } catch (err) {
    setResult(`Error: ${err?.message || String(err)}`);
  } finally {
    setBusy(false);
  }
});

helloForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = (nameInput.value || "").trim();
  if (!name) {
    setResult("Masukkan nama dulu.");
    nameInput.focus();
    return;
  }

  setBusy(true);
  try {
    const data = await fetchJson("/hello", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setResult(data?.status ?? JSON.stringify(data));
  } catch (err) {
    setResult(`Error: ${err?.message || String(err)}`);
  } finally {
    setBusy(false);
  }
});

setResult("Siap. Klik tombol untuk memulai.");
