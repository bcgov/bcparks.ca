const _ = require("lodash");

const KEYCLOAK_AUTH_ROLES = ["submitter", "approver"];
const API_USER_EMAIL = process.env.STRAPI_API_USER_EMAIL;

module.exports = async (ctx, next) => {
  let role;

  if (ctx.state.user) {
    // request is already authenticated in a different way
    return next();
  }

  // add the detection of `token` query parameter
  if (ctx.request && ctx.request.header && ctx.request.header.authorization) {
    try {
      // init `id` outside of validation blocks
      let id;
      let keycloakJwtToken;
      let strapiTextToken;

      // get information if token is keycloak type
      keycloakJwtToken = await strapi.plugins[
        "users-permissions"
      ].services.jwt.getKCToken(ctx);
      if (!keycloakJwtToken) {
        // get information if token is strapi type
        strapiTextToken = await strapi.plugins[
          "users-permissions"
        ].services.jwt.getStrapiToken(ctx);
      }

      if (keycloakJwtToken) {
        // fetch authenticated user using keycloak creds
        if (keycloakJwtToken.resource_access?.['staff-portal']?.roles) {
          const roles = keycloakJwtToken.resource_access['staff-portal'].roles;
          const roleMatch = roles.some((e) =>
            KEYCLOAK_AUTH_ROLES.includes(e)
          );

          if (!API_USER_EMAIL) {
            throw new Error("API_USER_EMAIL value not set");
          }

          if (roleMatch) {
            ctx.state.user = await strapi.plugins[
              "users-permissions"
            ].services.user.fetch({ email: API_USER_EMAIL });
            strapi.log.warn(`Staff Portal user "${keycloakJwtToken.email}" authenticated with Keycloak`)
          } else {
            throw new Error(
              "Invalid token: User role does not have access permissions"
            );
          }
        } else {
          throw new Error(
            "Invalid token: Token did not contain required fields"
          );
        }
      }

      if (strapiTextToken) {
        const [strapiToken] = await strapi
          .query("token")
          .find({ token: strapiTextToken });

        if (!strapiToken) {
          throw new Error(`Invalid token: This token doesn't exist`);
        } else {
          if (strapiToken.user && typeof strapiToken.token === "string") {
            id = strapiToken.user.id;
            // fetch authenticated user
            ctx.state.user = await strapi.plugins[
              "users-permissions"
            ].services.user.fetchAuthenticatedUser(id);
            strapi.log.warn(
              `External application user "${strapiToken.user.email
              }" authenticated with a Strapi token (token_id=${strapiToken.id})`
            )
          }
        }
      }
    } catch (err) {
      return handleErrors(ctx, err, "unauthorized");
    }

    if (!ctx.state.user) {
      return handleErrors(ctx, "User Not Found", "unauthorized");
    }

    role = ctx.state.user.role;

    if (role.type === "root") {
      return await next();
    }

    const store = await strapi.store({
      environment: "",
      type: "plugin",
      name: "users-permissions",
    });

    if (
      _.get(await store.get({ key: "advanced" }), "email_confirmation") &&
      !ctx.state.user.confirmed
    ) {
      return handleErrors(
        ctx,
        "Your account email is not confirmed.",
        "unauthorized"
      );
    }

    if (ctx.state.user.blocked) {
      return handleErrors(
        ctx,
        "Your account has been blocked by the administrator.",
        "unauthorized"
      );
    }
  }

  // Retrieve `public` role.
  if (!role) {
    role = await strapi
      .query("role", "users-permissions")
      .findOne({ type: "public" }, []);
  }

  const route = ctx.request.route;
  const permission = await strapi
    .query("permission", "users-permissions")
    .findOne(
      {
        role: role.id,
        type: route.plugin || "application",
        controller: route.controller,
        action: route.action,
        enabled: true,
      },
      []
    );

  if (!permission) {
    return handleErrors(ctx, undefined, "forbidden");
  }

  // Execute the policies.
  if (permission.policy) {
    return await strapi.plugins["users-permissions"].config.policies[
      permission.policy
    ](ctx, next);
  }

  // Execute the action.
  await next();
};

const handleErrors = (ctx, err = undefined, type) => {
  throw strapi.errors[type](err);
};
