import { useKeycloak } from "@react-keycloak/web";
import { hasRole } from "../utils/AuthenticationUtil";

export default function PrivateElement(roles) {
  const { keycloak, initialized } = useKeycloak();
  return hasRole(initialized, keycloak, roles);
}
