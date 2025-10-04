export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  REFRESH_TOKEN: "refresh_token",
  USER_SESSION: "user_session", // objeto serializado: name, email, mainAddress, etc.
  USER_ID: "user_id",
  GUEST_CART: "guest_cart_v1", // key para carrito de invitado en localStorage
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

// Lista de claves relacionadas con autenticación (útil para limpieza centralizada)
export const AUTH_STORAGE_KEYS = [
  STORAGE_KEYS.AUTH_TOKEN,
  STORAGE_KEYS.REFRESH_TOKEN,
  STORAGE_KEYS.USER_SESSION,
  STORAGE_KEYS.USER_ID,
] as const;

/**
 * Limpia las keys de auth del localStorage.
 * Nota: chequear `typeof window !== "undefined"` antes de usar en contexto SSR.
 */
export function clearAuthStorage(): void {
  if (typeof window === "undefined") return;
  try {
    AUTH_STORAGE_KEYS.forEach((k) => localStorage.removeItem(k));
  } catch {
    /* ignore */
  }
}