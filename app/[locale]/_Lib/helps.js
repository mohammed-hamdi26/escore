export function mappedArrayToSelectOptions(array, labelKey, valueKey) {
  return array.map((item) => ({
    name: item[labelKey],
    value: item[valueKey],
  }));
}
