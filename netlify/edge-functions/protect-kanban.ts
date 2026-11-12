const SESSION_COOKIE = "kanban_access";

const redirectToIndex = () =>
  new Response(null, {
    status: 302,
    headers: {
      Location: "/",
      "Cache-Control": "no-store",
    },
  });

export default async (request: Request, context: { next: () => Promise<Response> }) => {
  const sessionSecret = Netlify.env.get("SESSION_SECRET");
  if (!sessionSecret) {
    console.error("SESSION_SECRET must be configured.");
    return new Response("Authentication is not configured.", {
      status: 500,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const cookieHeader = request.headers.get("Cookie") ?? "";
  const sessionCookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE}=`));
  const token = sessionCookie?.slice(SESSION_COOKIE.length + 1);
  const match = token?.match(/^(\d{1,12})\.([A-Za-z0-9_-]{43})$/);
  if (!match) {
    return redirectToIndex();
  }

  const [, expiresAt, encodedSignature] = match;
  if (Number(expiresAt) <= Math.floor(Date.now() / 1000)) {
    return redirectToIndex();
  }

  const signature = Uint8Array.from(
    atob(encodedSignature.replace(/-/g, "+").replace(/_/g, "/") + "="),
    (character) => character.charCodeAt(0),
  );
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(sessionSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );
  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    signature,
    new TextEncoder().encode(expiresAt),
  );
  return valid ? context.next() : redirectToIndex();
};
