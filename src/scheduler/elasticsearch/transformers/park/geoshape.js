/* 
  Flattens Polygon or MultiPolygon coordinates into a unique array 
  of Elasticsearch points with precision reduced to [decimalPlaces] 
*/
const flatten = function (shape, decimalPlaces) {
  const result = [];
  if (shape) {
    const flattened = shape.flat(Infinity);
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
};

/*
  Adds an new point to the array created by flatten with precision 
  reduced to [decimalPlaces] 
*/
const appendPoint = function (points, lat, lon, decimalPlaces) {
  const newPoint = `${lat.toFixed(decimalPlaces)},${lon.toFixed(decimalPlaces)}`;
  if (points.indexOf(newPoint) === -1) {
    return [...[newPoint], ...points];
  } else {
    return points;
  }
};

/* 
   Reduces an array of geo-points to only include points from the 
   outer bounds 
*/
const outline = function (points) {
  if (points.length < 3) {
    return points;
  }

  const cols = {};
  const rows = {};

  const strMax = function (a, b) {
    return a > b ? a : b;
  };

  const strMin = function (a, b) {
    return a < b ? a : b;
  };

  for (const point of points) {
    const coords = point.split(",");
    if (!rows[coords[0]]) {
      rows[coords[0]] = { max: point, min: point };
    } else {
      const r = rows[coords[0]];
      rows[coords[0]] = { max: strMax(point, r.max), min: strMin(point, r.min) };
    }

    if (!cols[coords[1]]) {
      cols[coords[1]] = { max: point, min: point };
    } else {
      const c = cols[coords[1]];
      cols[coords[1]] = { max: strMax(point, c.max), min: strMin(point, c.min) };
    }
  }

  const result = [];

  for (const key in rows) {
    const item = rows[key];
    if (result.indexOf(item.max) === -1) {
      result.push(item.max);
    }
    if (result.indexOf(item.min) === -1) {
      result.push(item.min);
    }
  }

  for (const key in cols) {
    const item = cols[key];
    if (result.indexOf(item.max) === -1) {
      result.push(item.max);
    }
    if (result.indexOf(item.min) === -1) {
      result.push(item.min);
    }
  }

  return result;
};

/*
  Adds extra points along long lines
*/
const fillLongSegments = function (shape, points, decimalPlaces) {
  const extraMultiplier = 2; // a higher value limits the # of points added. 10 is equal to a full decimalPlace
  let polygons = [];
  let maxSegment = Math.pow(10, -1 * decimalPlaces);
  const increment = +(maxSegment * extraMultiplier).toFixed(decimalPlaces);

  if (shape?.geometry?.type === "Polygon") {
    polygons = shape.geometry.coordinates;
  }

  if (shape?.geometry?.type === "MultiPolygon") {
    polygons = shape.geometry.coordinates.flat(1);
  }

  for (const polygon of polygons) {
    for (let i = 0; i < polygon.length - 1; i++) {
      const p1 = polygon[i];
      const p2 = polygon[i + 1];
      let lat1 = p1[1];
      let lon1 = p1[0];
      let lat2 = p2[1];
      let lon2 = p2[0];
      const vertDiff = Math.abs(lat1 - lat2);
      const horizDiff = Math.abs(lon1 - lon2);
      if (vertDiff > increment || horizDiff > increment) {
        if (vertDiff > horizDiff) {
          if (lat1 > lat2) {
            lat2 = lat1;
            lon2 = lon1;
            lat1 = p2[1];
            lon1 = p2[0];
          }
          let newLat = +lat1.toFixed(decimalPlaces - 1) + increment;
          let newLon = lon1 + ((newLat - lat1) / (lat2 - lat1)) * (lon2 - lon1);
          while (newLat < lat2) {
            if (newLat > lat1) {
              points = appendPoint(points, newLat, newLon, 2);
            }
            newLat += increment;
            newLon += (increment / (lat2 - lat1)) * (lon2 - lon1);
          }
        } else {
          if (lon1 > lon2) {
            lat2 = lat1;
            lon2 = lon1;
            lat1 = p2[1];
            lon1 = p2[0];
          }
          let newLon = +lon1.toFixed(decimalPlaces - 1) + increment;
          let newLat = lat1 + ((newLon - lon1) / (lon2 - lon1)) * (lat2 - lat1);
          while (newLon < lon2) {
            if (newLon > lon1) {
              points = appendPoint(points, newLat, newLon, 2);
            }
            newLon += increment;
            newLat += (increment / (lon2 - lon1)) * (lat2 - lat1);
          }
        }
      }
    }
  }
  return points;
};

module.exports = {
  outline,
  flatten,
  appendPoint,
  fillLongSegments,
};
