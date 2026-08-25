/**
 * Legal-domain vocabulary shared by more than one feature.
 *
 * `ArticleStatus` is used by the ruling generator (cited articles) and by law
 * search (browse/filter), so it lives in core rather than in one feature and
 * the two sides can never drift apart.
 *
 * `CaseCategory` is the ruling generator's alone now: the cases corpus turned
 * out to describe a judgment by its charges (`crimes`) and its `outcome`, both
 * free Arabic text, so precedent search has no enum to share.
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
