import { headers } from "next/headers";

const resolveMaybePromise = async (value) => {
  if (value && typeof value.then === "function") {
    return await value;
  }
  return value;
};

export const getBaseUrl = async () => {
  if (typeof window !== "undefined") {
    return "";
  }

  try {
    const incoming = await resolveMaybePromise(headers());
    const host = typeof incoming?.get === "function" ? incoming.get("host") : incoming?.host;
    if (host) {
      const protocol = host.includes("localhost") || host.startsWith("127.") ? "http" : "https";
      return `${protocol}://${host}`;
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("getBaseUrl: falling back to NEXT_PUBLIC_APP_URL", error);
    }
  }

  const normalize = (value) => {
    if (!value || typeof value !== "string") return value;
    let normalized = value.endsWith("/") ? value.slice(0, -1) : value;
    if (!/^https?:\/\//i.test(normalized)) {
      const protocol = normalized.includes("localhost") || normalized.startsWith("127.") ? "http" : "https";
      normalized = `${protocol}://${normalized}`;
    }
    return normalized;
  };

  // Prefer explicit base URLs when running without request headers (e.g. ISR).
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return normalize(process.env.NEXT_PUBLIC_BASE_URL);
  }

  if (process.env.NEXT_PUBLIC_APP_URL) {
    return normalize(process.env.NEXT_PUBLIC_APP_URL);
  }

  // Vercel provides VERCEL_URL in production builds/runtimes.
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Avoid falling back to localhost in production.
  if (process.env.NODE_ENV === "production") {
    return "https://www.iidad.com";
  }

  return "http://localhost:3000";
};
