/**
 * Returns the depth (level of nesting) of a pathname by counting non-empty segments.
 *
 * @param {string} pathname - The path to calculate the depth for.
 * @returns {number} The depth (number of segments).
 */
export const getDepth = (pathname: string) => pathname.split('/').filter(Boolean).length;
