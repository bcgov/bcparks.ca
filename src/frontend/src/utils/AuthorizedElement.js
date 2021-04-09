import AuthorizedFunction from "../../utilities/AuthorizedFunction";

export default function AuthorizedElement(roles, children) {
  return AuthorizedFunction(roles) && children;
}
