export function setDirection(locale: string) {
  return locale === "ar" ? "rtl" : "ltr";
}
export function setDirectionReverse(locale: string) {
  return locale === "ar" ? "ltr" : "rtl";
}
export function setTextDirection(locale: string) {
  return locale === "ar" ? "text-right" : "text-left";
}
export function setPosition(locale: string) {
  return locale === "ar" ? "bottom-right" : "bottom-left";
}
export function setSide(locale: string) {
  return locale === "ar" ? "right" : "left";
}
export function setSideRelative(locale: string) {
  return locale === "ar" ? "left-0" : "right-0";
}

export function getBaseUrlByModule(mod?: string): string {
  switch (mod) {
    default:
      console.warn(`⚠️ Unknown module "${mod}", using CIF as default.`);
      return process.env.NEXT_PUBLIC_API_CIF_BASE_URL ?? "";
  }
}
