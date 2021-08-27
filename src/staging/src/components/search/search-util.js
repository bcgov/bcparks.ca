const labelCompare = (a, b) => {
  if (a.label.toLowerCase() < b.label.toLowerCase()) {
    return -1
  }
  if (a.label.toLowerCase() > b.label.toLowerCase()) {
    return 1
  }
  return 0
}

const compare = (a, b) => {
  if (a.toLowerCase() < b.toLowerCase()) {
    return -1
  }
  if (a.toLowerCase() > b.toLowerCase()) {
    return 1
  }
  return 0
}

export { labelCompare, compare }
