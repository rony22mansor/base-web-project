/**
 * Locale-less route constants. Always navigate with these + the next-intl
 * helpers in `core/i18n/navigation` — never hard-code a path string.
 */
export class AppRoutes {
  // root
  static root = "/";

  // features
  static rulingGenerator = "/ruling-generator";
  static summarization = "/summarization";
  static classification = "/classification";
  static lawSearch = "/law-search";
  static caseSearch = "/case-search";
  static contractTemplates = "/contract-templates";

  // detail views
  /**
   * One law's articles. Law ids are Arabic and contain spaces, so the segment
   * is encoded here — the page decodes it back with `decodeURIComponent`.
   */
  static law = (lawId: string) => `/law-search/${encodeURIComponent(lawId)}`;
  /** Same law, read straight through as a book (chapters + sections). */
  static lawBook = (lawId: string) => `${AppRoutes.law(lawId)}?view=book`;
  static caseDetail = (id: string) => `/case-search/${id}`;
  /**
   * The fill-in editor for one template. Doc ids carry a `#`
   * ("390277833119024#2"), so the segment is encoded here and the page decodes
   * it back — an unencoded one would be read as a URL fragment and lost.
   */
  static contractTemplate = (docId: string) =>
    `/contract-templates/${encodeURIComponent(docId)}`;


  // auth (unwired — auth strategy is TBD)
  static login = "/login";
}
