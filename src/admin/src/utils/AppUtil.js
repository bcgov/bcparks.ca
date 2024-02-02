export function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

export function a11yProps(index, label) {
  return {
    id: `${label}-${index}`,
    "aria-controls": `${label}-${index}`,
  };
}

export function labelCompare(a, b) {
  if (a.label < b.label) {
    return -1;
  }
  if (a.label > b.label) {
    return 1;
  }
  return 0;
}

export function dateCompare(a, b) {
  if (a.dateToCompare > b.dateToCompare) {
    return -1;
  }
  if (a.dateToCompare < b.dateToCompare) {
    return 1;
  }
  return 0;
}

export function camelCaseToSentenceCase(input) {
  if (!input) {
    return "";
  }
  return input[0].toUpperCase() + input.slice(1).toLowerCase();
}