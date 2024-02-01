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
  // split the string into words based on capital letters
  const words = input.match(/[A-Z][a-z]+/g)
  if (!words) {
    return input
  }
  // lowercase all words except the first one
  const sentenceCasedWords = words.map((word, index) =>
    index === 0 ? word : word.toLowerCase()
  )
  return sentenceCasedWords.join(' ')
}