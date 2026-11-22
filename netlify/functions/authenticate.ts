import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const SESSION_COOKIE = "kanban_access";
const SESSION_DURATION_SECONDS = 60 * 60;

const jsonResponse = (status: number, body: { error: string }, headers?: HeadersInit) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...headers,
    },
  });

export default async (request: Request): Promise<Response> => {
  if (request.method !== "POST") {
    return jsonResponse(405, { error: "Method not allowed." }, { Allow: "POST" });
  }

  const expectedPassword = process.env.KANBAN_PASSWORD;
  const sessionSecret = process.env.SESSION_SECRET;
  if (!expectedPassword || !sessionSecret) {
    console.error("KANBAN_PASSWORD and SESSION_SECRET must be configured.");
    return jsonResponse(500, { error: "Authentication is not configured." });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(400, { error: "Invalid request." });
  }

  const password =
    typeof body === "object" && body !== null && "password" in body
      ? body.password
      : undefined;
  if (typeof password !== "string" || password.length === 0 || password.length > 1024) {
    return jsonResponse(400, { error: "Invalid request." });
  }

  const suppliedDigest = createHash("sha256").update(password, "utf8").digest();
  const expectedDigest = createHash("sha256").update(expectedPassword, "utf8").digest();
  if (!timingSafeEqual(suppliedDigest, expectedDigest)) {
    return jsonResponse(401, { error: "Incorrect password." });
  }

  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS;
  const payload = String(expiresAt);
  const signature = createHmac("sha256", sessionSecret).update(payload).digest("base64url");
  const cookie = `${SESSION_COOKIE}=${payload}.${signature}; Max-Age=${SESSION_DURATION_SECONDS}; Path=/; HttpOnly; Secure; SameSite=Lax`;

  return jsonResponse(200, { success: true }, { "Set-Cookie": cookie });
};
