/**
 * Request for `POST /api/legal/summarize`. The server rejects anything under
 * 10 characters; the form asks for considerably more, since an extractive
 * summariser needs sentences to choose between.
 */
export interface SummarizeCaseDto {
  text: string;
}
