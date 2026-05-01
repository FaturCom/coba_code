function getApiBase() {
  const url = new URL(window.location.href);
  const apiFromQuery = url.searchParams.get("api");
  if (apiFromQuery) return apiFromQuery.replace(/\/+$/, "");
  
  // Langsung mengambil URL website tempat file ini berada sekarang
  return window.location.origin;
}

const API_BASE = getApiBase();

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
  try {
    const res = await fetch(`${API_BASE}${path}`, options);
    const contentType = res.headers.get("content-type") || "";
    const body = contentType.includes("application/json") ? await res.json() : await res.text();
    
    if (!res.ok) {
      const detail = typeof body === "string" ? body : JSON.stringify(body);
      throw new Error(`HTTP ${res.status}: ${detail}`);
    }
    return body;
  } catch (err) {
    throw err;
  }
}

btnHelloWorld.addEventListener("click", async () => {
  setBusy(true);
  try {
    // Memanggil rute /api milik backend
    const data = await fetchJson("/api", { method: "GET" });
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
    // Memanggil rute /api/hello milik backend
    const data = await fetchJson("/api/hello", {
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