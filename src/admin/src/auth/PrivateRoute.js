import { useKeycloak } from "@react-keycloak/web";
import React, { useState, useEffect } from "react";
import { Route } from "react-router-dom";
import Error from "../components/page/error/Error";
import { hasRole } from "../utils/AuthenticationUtil";

export function PrivateRoute({ component: Component, roles, props, ...rest }) {
  const { keycloak, initialized } = useKeycloak();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [toError, setToError] = useState(false);

  console.log('keycloak', keycloak)
  console.log('initialized', initialized)

  useEffect(() => {
    if (!initialized) {
      setIsLoading(true);
      setIsAuthorized(false);
    } else if (!keycloak.authenticated) {
      setToError(true);
    }
    if (initialized) {
      setIsAuthorized(hasRole(initialized, keycloak, roles));
      setIsLoading(false);
    }
  }, [setIsAuthorized, setIsLoading, initialized, keycloak, roles]);

  console.log('TODO: remove console later', toError )

  if (toError) {
    return (
      <Error
        page={{
          error: {
            status: 401,
            message: "Login required",
          },
        }}
      />
    );
  }
  console.log("isAuthorized", isAuthorized)
  return (
    <div>
      {!isLoading && (
        <Route
          {...rest}
          render={() => {
            return isAuthorized ? (
              <Component {...props} />
            ) : (
              <Error
                page={{
                  error: {
                    status: 403,
                    message: "Unauthorized",
                  },
                }}
              />
            );
          }}
        />
      )}
    </div>
  );
}
