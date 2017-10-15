/* eslint-disable import/prefer-default-export  */
export function makeURLCompatible(value) {
  if (typeof value === 'string') {
    return value.replace(/ /g, '_').toLowerCase();
  }

  return value.toString();
}
