/**
 * Standard error retruend from API
 */
export type TError = {
  status: number;
  error: string;
  message: string;
  path: string;
  /**For fields validation (if there is), eg
   * {name: "Name is required", email: ["Email is required", "Minimum length 2"]}
   */
  validationError?: Record<string, string | Array<string>>;
  code?: string;
  traceId?: string;
  traceError?: string;
};
