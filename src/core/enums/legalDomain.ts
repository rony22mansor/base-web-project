/**
 * Legal-domain vocabulary shared by more than one feature.
 *
 * `ArticleStatus` is used by the ruling generator (cited articles) and by law
 * search (browse/filter); `CaseCategory` by the ruling generator (precedents)
 * and by case search. They live in core rather than in one feature so the two
 * sides can never drift apart — everything else stays feature-local.
 */

/** Lifecycle status of a law article, per CLAUDE_monsif.md's data model. */
export enum ArticleStatus {
  Regular = "regular",
  Amended = "amended",
  Repealed = "repealed",
}

/** Court category a case belongs to. */
export enum CaseCategory {
  Civil = "civil",
  Criminal = "criminal",
  Commercial = "commercial",
}
