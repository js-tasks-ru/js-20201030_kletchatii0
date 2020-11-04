/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
    const order = param === 'asc' ? 1 : -1;
    return [...arr].sort((s1, s2) => order * s1.localeCompare(s2, "ru", {"caseFirst": "upper"}));
}
