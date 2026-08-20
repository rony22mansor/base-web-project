import { cookies } from "next/headers";

export class ServerCookies {
  /**
   * Set New Cookie (server-side)
   */
  public static async set(
    key: string,
    value: string,
    options?: Parameters<Awaited<ReturnType<typeof cookies>>["set"]>[2]
  ): Promise<void> {
    const jar = await cookies();
    jar.set(key, value, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      ...options,
    });
  }

  /**
   * Get Cookie (server-side)
   */
  public static async get(key: string): Promise<string | undefined> {
    const jar = await cookies();
    return jar.get(key)?.value;
  }

  /**
   * Delete Cookie (server-side)
   */
  public static async remove(key: string): Promise<void> {
    const jar = await cookies();
    jar.delete(key);
  }

  /**
   * Check if the cookie exists (server-side)
   */
  public static async has(key: string): Promise<boolean> {
    const jar = await cookies();
    return jar.has(key);
  }

  /**
   * Clear all cookies (server-side)
   */
  public static async clearAll(): Promise<void> {
    const jar = await cookies();
    jar.getAll().forEach((cookie) => jar.delete(cookie.name));
  }
}
