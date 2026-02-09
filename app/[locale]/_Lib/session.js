import "server-only";
import { cookies } from "next/headers";
import crypto from "crypto";

// Encryption configuration
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 32;

// Get encryption key from environment or generate a secure default
function getEncryptionKey() {
  const secret = process.env.SESSION_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) {
    console.warn(
      "Warning: SESSION_SECRET not set. Using a derived key for development."
    );
    // For development, derive a key from a constant (not secure for production)
    return crypto.scryptSync("escore-dev-secret-key", "salt", 32);
  }
  // Derive a 32-byte key from the secret using scrypt
  return crypto.scryptSync(secret, "escore-session-salt", 32);
}

/**
 * Encrypt a token using AES-256-GCM
 * @param {string} token - The plain text token to encrypt
 * @returns {string} - Base64 encoded encrypted token with IV and auth tag
 */
function encryptToken(token) {
  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(token, "utf8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag();

    // Combine IV + AuthTag + Encrypted data and encode as base64
    const combined = Buffer.concat([
      iv,
      authTag,
      Buffer.from(encrypted, "hex"),
    ]);

    return combined.toString("base64");
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt session token");
  }
}

/**
 * Decrypt an encrypted token
 * @param {string} encryptedToken - Base64 encoded encrypted token
 * @returns {string|null} - Decrypted token or null if decryption fails
 */
function decryptToken(encryptedToken) {
  try {
    const key = getEncryptionKey();
    const combined = Buffer.from(encryptedToken, "base64");

    // Extract IV, auth tag, and encrypted data
    const iv = combined.subarray(0, IV_LENGTH);
    const authTag = combined.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
    const encrypted = combined.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, undefined, "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("Decryption error:", error.message);
    return null;
  }
}

/**
 * Save session token securely with encryption
 * @param {string} token - The JWT token to save
 */
export async function saveSession(token) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const cookieStore = await cookies();

  // Only use secure cookies in production with HTTPS
  const isProduction = process.env.NODE_ENV === "production";
  const isHttps = process.env.NEXT_PUBLIC_BASE_URL?.startsWith("https://");

  // Encrypt the token before storing
  const encryptedToken = encryptToken(token);

  cookieStore.set("session", encryptedToken, {
    httpOnly: true, // Prevents JavaScript access (XSS protection)
    secure: isProduction && isHttps, // HTTPS only in production
    expires: expiresAt,
    sameSite: "lax", // CSRF protection
    path: "/",
  });

  // Save JWT expiry as a plain cookie so middleware can check it
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64url").toString()
    );
    if (payload.exp) {
      cookieStore.set("token_exp", String(payload.exp), {
        httpOnly: true,
        secure: isProduction && isHttps,
        expires: expiresAt,
        sameSite: "lax",
        path: "/",
      });
    }
  } catch {
    // If token isn't a valid JWT, skip expiry cookie
  }
}

/**
 * Get the decrypted session token
 * @returns {Promise<string|null>} - Decrypted token or null
 */
export async function getSession() {
  const cookieStore = await cookies();
  const encryptedToken = cookieStore.get("session")?.value;

  if (!encryptedToken) {
    return null;
  }

  return decryptToken(encryptedToken);
}

/**
 * Save refresh token securely with encryption
 * @param {string} token - The refresh JWT token to save
 */
export async function saveRefreshToken(token) {
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  const cookieStore = await cookies();

  const isProduction = process.env.NODE_ENV === "production";
  const isHttps = process.env.NEXT_PUBLIC_BASE_URL?.startsWith("https://");

  const encryptedToken = encryptToken(token);

  cookieStore.set("refresh_token", encryptedToken, {
    httpOnly: true,
    secure: isProduction && isHttps,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

/**
 * Get the decrypted refresh token
 * @returns {Promise<string|null>} - Decrypted refresh token or null
 */
export async function getRefreshToken() {
  const cookieStore = await cookies();
  const encryptedToken = cookieStore.get("refresh_token")?.value;

  if (!encryptedToken) {
    return null;
  }

  return decryptToken(encryptedToken);
}

/**
 * Delete all session cookies (access + refresh)
 */
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  cookieStore.delete("refresh_token");
  cookieStore.delete("token_exp");
}

/**
 * Check if session exists and is valid
 * @returns {Promise<boolean>}
 */
export async function hasValidSession() {
  const token = await getSession();
  return token !== null;
}

/**
 * Refresh session by calling the backend refresh-token endpoint
 * @returns {Promise<string|null>} - New access token or null if refresh failed
 */
export async function refreshSession() {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;

  try {
    const axios = (await import("axios")).default;
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/refresh-token`,
      { refreshToken }
    );

    const tokens = res?.data?.data?.tokens;
    if (tokens?.accessToken && tokens?.refreshToken) {
      // Try to save cookies — only works in Server Actions & Route Handlers.
      // In Server Components this will throw, but we still return the token
      // so the interceptor can retry the current request.
      try {
        await saveSession(tokens.accessToken);
        await saveRefreshToken(tokens.refreshToken);
      } catch {
        // Cookie writes fail in Server Components — that's expected.
      }
      return tokens.accessToken;
    }

    return null;
  } catch {
    // Refresh token is invalid or expired — user must login again
    return null;
  }
}
