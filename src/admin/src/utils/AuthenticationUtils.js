export function hasRole(initialized, keycloak, roles) {
  if (initialized && keycloak && roles) {
    return roles.some((r) => {
      const realm = keycloak.hasRealmRole(r);
      const resource = keycloak.hasResourceRole(r);
      return realm || resource;
    });
  }
  return false;
}
