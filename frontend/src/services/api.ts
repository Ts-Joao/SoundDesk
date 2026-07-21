const API = process.env.NEXT_PUBLIC_API_URL!;

let tokenMgr: typeof import("@/lib/auth/tokenManager").tokenManager | null = null;

async function getTokenMgr() {
  if (typeof window === "undefined") return null;
  if (!tokenMgr) {
    const mod = await import("@/lib/auth/tokenManager");
    tokenMgr = mod.tokenManager;
  }
  return tokenMgr;
}

let isRefreshing = false;
let refreshQueue: Array<(t: string | null) => void> = [];

async function doRefresh(): Promise<string | null> {
  const tm = await getTokenMgr();
  if (!tm) return null;
  const rt = tm.getRefresh();
  if (!rt) return null;
  try {
    const res = await fetch(`${API}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: rt }),
    });
    if (!res.ok) { tm.clearTokens(); return null; }
    const d = await res.json();
    tm.setTokens(d.access_token, d.refresh_token ?? rt);
    return d.access_token;
  } catch {
    tm.clearTokens();
    return null;
  }
}

export async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const tm = await getTokenMgr();
  const token = tm?.getAccess();

  const headers: Record<string, string> = { "Content-Type": "application/json", ...(options.headers as Record<string, string>) };
  if (options.body instanceof FormData) delete headers["Content-Type"];
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API}/api${endpoint}`, { ...options, headers });

  if (res.status === 401 && tm) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push(async (nt) => {
          if (!nt) return reject(new Error("Sessão expirada"));
          headers["Authorization"] = `Bearer ${nt}`;
          const r = await fetch(`${API}/api${endpoint}`, { ...options, headers });
          if (!r.ok) return reject(new Error(await r.text()));
          resolve(r.json());
        });
      });
    }
    isRefreshing = true;
    const nt = await doRefresh();
    isRefreshing = false;
    refreshQueue.forEach((cb) => cb(nt));
    refreshQueue = [];
    if (!nt) {
      if (typeof window !== "undefined") window.location.href = "/login";
      throw new Error("Sessão expirada");
    }
    headers["Authorization"] = `Bearer ${nt}`;
    const r2 = await fetch(`${API}/api${endpoint}`, { ...options, headers });
    if (!r2.ok) throw new Error(await r2.text());
    return r2.json();
  }

  if (!res.ok) throw new Error(await res.text() || `HTTP ${res.status}`);
  if (res.status === 204) return undefined as T;
  return res.json();
}
