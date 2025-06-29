/**
 * Finds the first element in the array that satisfies the provided predicate function,
 * and returns both the element and its index. Returns undefined if no element matches.
 *
 * @template T - Type of array elements
 * @param {T[]} array - The array to search
 * @param {(value: T, index: number, array: T[]) => boolean} predicate - Function to test each element
 * @returns {{ item: T; index: number } | undefined} The found element and its index, or undefined if not found
 */
export const findWithIndex = <T>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => boolean,
): { item: T; index: number } | undefined => {
  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i], i, array)) {
      return { item: array[i], index: i };
    }
  }
};
