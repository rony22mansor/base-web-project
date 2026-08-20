import Cookies from "js-cookie";

export class AppCookies {
  // Default Options
  private static defaultOptions: Cookies.CookieAttributes = {
    sameSite: "Lax",
    secure: true,
  };

  /**
   * Set New Cookies
   */
  public static set(
    key: string,
    value: string,
    options?: Cookies.CookieAttributes
  ): void {
    Cookies.set(key, value, { ...this.defaultOptions, ...options });
  }

  /**
   * Get Cookie
   */
  public static get(key: string): string | undefined {
    return Cookies.get(key);
  }

  /**
   * Delete Cookie
   */
  public static remove(key: string): void {
    Cookies.remove(key);
  }

  /**
   * Clear All Cookies
   */
  public static clearAll(): void {
    const allCookies = Cookies.get();
    for (const cookie in allCookies) {
      Cookies.remove(cookie);
    }
  }

  /**
   * Check if the cookie exist
   */
  public static has(key: string): boolean {
    return !!Cookies.get(key);
  }
}
