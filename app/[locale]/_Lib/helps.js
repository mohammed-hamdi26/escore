export function mappedArrayToSelectOptions(array, labelKey, valueKey) {
  return array.map((item) => ({
    name: item[labelKey],
    value: item[valueKey],
  }));
}
export function getNumPages(totalItems, pageSize) {
  return totalItems === pageSize
    ? 0
    : Math.floor(totalItems / (pageSize || 20));
}
