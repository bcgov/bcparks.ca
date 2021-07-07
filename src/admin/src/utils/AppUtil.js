export function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

export function a11yProps(index, label) {
  return {
    id: `${label}-${index}`,
    "aria-controls": `${label}-${index}`,
  };
}
