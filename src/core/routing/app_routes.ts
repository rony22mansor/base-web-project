/**
 * Locale-less route constants. Always navigate with these + the next-intl
 * helpers in `core/i18n/navigation` — never hard-code a path string.
 */
export class AppRoutes {
  // root
  static root = "/";

  // features
  static rulingGenerator = "/ruling-generator";
  static lawSearch = "/law-search";
  static caseSearch = "/case-search";
  static contractTemplates = "/contract-templates";

  // detail views (not built yet — see ui-features.md open questions)
  static lawArticle = (id: string) => `/law-search/${id}`;
  static caseDetail = (id: string) => `/case-search/${id}`;
  static contractTemplate = (id: string) => `/contract-templates/${id}`;


  // auth (unwired — auth strategy is TBD)
  static login = "/login";
}
