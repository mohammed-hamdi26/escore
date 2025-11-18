export function mappedArrayToSelectOptions(array, labelKey, valueKey) {
  return array.map((item) => ({
    name: item[labelKey],
    value: item[valueKey],
    image: item.image ? item.image : item.logo ? item.logo : "",
  }));
}
export function getNumPages(totalItems, pageSize) {
  return totalItems === pageSize
    ? 0
    : Math.floor(totalItems / (pageSize || 20));
}

export function getFirst10Words(str) {
  if (!str) return "";
  if (str.length <= 10) return str;
  return str.trim().split(/\s+/).slice(0, 10).join(" ") + " ...";
}
