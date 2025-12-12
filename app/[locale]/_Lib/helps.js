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
export function combineDateAndTime(date, time) {
  if (!date || !time) return null;

  // Example time input: "02:30 PM"
  const [timePart, modifier] = time.split(" "); // ["02:30", "PM"]
  let [hours, minutes, seconds] = timePart.split(":").map(Number);

  // Convert to 24-hour format
  if (modifier === "PM" && hours !== 12) {
    hours += 12;
  }
  if (modifier === "AM" && hours === 12) {
    hours = 0;
  }

  const result = new Date(date);
  result.setHours(hours, minutes, seconds || 0, 0);

  return result;
}

export function calculateAge(birthdate) {
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export function getFlagEmoji(countryCode) {
  // Check if the country code is exactly two letters long
  if (countryCode.length !== 2) {
    return "🏳️"; // Return a white flag as a default for invalid codes
  }

  // Convert the country code to uppercase as required by regional indicator symbols
  const upperCaseCode = countryCode.toUpperCase();

  // Map each character to its regional indicator symbol code point and create a string
  const codePoints = upperCaseCode
    .split("")
    .map((char) => 127397 + char.charCodeAt());

  return String.fromCodePoint(...codePoints);
}
