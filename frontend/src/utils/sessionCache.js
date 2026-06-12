// /frontend/src/utils/sessionCache.js
// Cache simples em sessionStorage com TTL

const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

export const getCache = (key) => {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) {
      sessionStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
};

export const setCache = (key, data) => {
  sessionStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
};

export const clearCache = (key) => {
  sessionStorage.removeItem(key);
};
