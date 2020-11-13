/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size === undefined) return string;
  if (size === 0) return '';
  let res = '';
  for (let i = 0; i < string.length; i++) {
    let y = i;
    for (; y < string.length; y++) {
      if ((y - i) < size) res += string[y];
      if (string[y] !== string[y + 1]) {
        break;
      }
    }
    i = y;
  }
  return res;
}
