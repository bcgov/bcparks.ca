import { useKeycloak } from "@react-keycloak/web";
import { hasRole } from "../utils/AuthenticationUtils";

export default function PrivateElement(roles) {
  const { keycloak, initialized } = useKeycloak();
  return hasRole(initialized, keycloak, roles);
}
