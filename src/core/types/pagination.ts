/**
 * One page of a browse/search listing.
 *
 * The Python backend's paging contract is not finalized yet (see
 * `endpoints.ts`); this is the shape the mocks return and the shape the
 * features consume. If the real API paginates differently, translate it in the
 * service layer so no component has to change.
 */
export interface PagedResult<T> {
  items: T[];
  /** 1-based. */
  page: number;
  pageSize: number;
  /** Total matching rows across all pages. */
  total: number;
  /** True when another page exists after this one. */
  hasMore: boolean;
}

/** Params every browse/search endpoint accepts, on top of its own filters. */
export interface PageParams {
  page: number;
  pageSize: number;
}

/** Rows per page for the browse/search grids. */
export const DEFAULT_PAGE_SIZE = 8;
