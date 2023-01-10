module.exports = function (slug) {
  const regex = new RegExp("^[a-z0-9\-\/]+(?:-[a-z0-9\-\/]+)*$|^$");
    if (!regex.test(slug)) {
      throw strapi.errors.badRequest('Please enter lower case letters, numbers, hyphens, or slashes for slug. No spaces.');
    }
}