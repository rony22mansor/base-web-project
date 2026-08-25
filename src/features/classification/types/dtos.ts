/**
 * Request for `POST /api/legal/classify`.
 *
 * The field is `facts`, not `text` — this is the one endpoint in the API that
 * names it differently, and sending `text` gets a 400.
 */
export interface ClassifyCaseDto {
  facts: string;
}
