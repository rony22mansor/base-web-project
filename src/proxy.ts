import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "./core/i18n/routing";

const intlMiddleware = createMiddleware(routing);

/**
 * Locale negotiation only. MONSIF has no auth yet (see CLAUDE_monsif.md) — when
 * it lands, the route guard belongs here, alongside token handling in apiClient.
 */
export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const response = intlMiddleware(req);

  if (response) {
    response.headers.set("x-pathname", pathname);
  }

  return response;
}

export const config = {
  // Skip API routes, Next internals, and anything with a file extension.
  // The dot is written as a character class so the escaping cannot collapse:
  // a bare `\.` here silently becomes `.`, which excludes every path and
  // disables locale negotiation entirely.
  matcher: "/((?!api|trpc|_next|_vercel|.*[.].*).*)",
};
