function flattenArray(obj) {
  return obj.map(e => flatten(e));
}

function flattenData(obj) {
  return flatten(obj.data);
}

function flattenAttrs(obj) {
  let attrs = {};
  for (var key in obj.attributes) {
    attrs[key] = flatten(obj.attributes[key]);
  }
  return {
    id: obj.id,
    ...attrs
  };
}

function flatten(obj) {
  if(Array.isArray(obj)) {
    return flattenArray(obj);
  }
  if(obj && obj.data) {
    return flattenData(obj);
  }
  if(obj && obj.attributes) {
    return flattenAttrs(obj);
  }
  return obj;
}

async function respond(ctx, next) {
  // This code if you want populate and get the all the depth on all endpoint without delare it in every db transaction
  // ctx.request.url = `${ctx.request.url}${ctx.request.url.includes("?") ? "&" : "?"}populate=${["menus", "protected-areas"].some(el=>ctx.request.url.includes(el)) ? "deep" : "*"}`

  await next();
  if (!ctx.url.startsWith('/api')) {
    return;
  }
  console.log(`API request (${ctx.url}) detected, transforming response json...`);

  ctx.response.body = flatten(ctx.response.body.data ? ctx.response.body.data : ctx.response.body);
}

module.exports = () => respond;
