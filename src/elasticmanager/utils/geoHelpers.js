/* 
  Flattens Polygon or MultiPolygon coordinates into a unique array 
  of Elasticsearch points with precision reduced to [decimalPlaces] 
*/
const flatten = function (shape, decimalPlaces) {
  const result = [];
  if (shape) {
    const flattened = shape.flat(Infinity)
    for (let i = 0; i < flattened.length; i += 2) {
      const lat = flattened[i + 1];
      const lon = flattened[i];
      const point = `${lat.toFixed(decimalPlaces)},${lon.toFixed(decimalPlaces)}`;
      if (result.indexOf(point) === -1) {
        result.push(point);
      }
    }
  }
  return result;
}

/*
  Adds an new point to the array created by flatten with precision 
  reduced to [decimalPlaces] 
*/
const appendPoint = function (points, lat, lon, decimalPlaces) {
  return [
    ...[`${lat.toFixed(decimalPlaces)},${lon.toFixed(decimalPlaces)}`],
    ...points
  ];
}

/* 
   Reduces an array of geo-points to only include points from the 
   outer bounds 
*/
const outline = function (points) {

  if (points.length < 3) {
    return points;
  }

  const cols = {}
  const rows = {}

  const strMax = function (a, b) {
    return a > b ? a : b;
  }

  const strMin = function (a, b) {
    return a < b ? a : b;
  }

  for (const point of points) {
    const coords = point.split(',')
    if (!rows[coords[0]]) {
      rows[coords[0]] = { max: point, min: point }
    } else {
      const r = rows[coords[0]];
      rows[coords[0]] = { max: strMax(point, r.max), min: strMin(point, r.min) }
    }

    if (!cols[coords[1]]) {
      cols[coords[1]] = { max: point, min: point }
    } else {
      const c = cols[coords[1]];
      cols[coords[1]] = { max: strMax(point, c.max), min: strMin(point, c.min) }
    }
  }

  const result = [];

  for (const key in rows) {
    const item = rows[key]
    if (result.indexOf(item.max) === -1) {
      result.push(item.max);
    }
    if (result.indexOf(item.min) === -1) {
      result.push(item.min);
    }
  }

  for (const key in cols) {
    const item = cols[key]
    if (result.indexOf(item.max) === -1) {
      result.push(item.max);
    }
    if (result.indexOf(item.min) === -1) {
      result.push(item.min);
    }
  }

  return result;
}

module.exports = {
  outline,
  flatten,
  appendPoint
}
