## Prerequisites

1. Make sure Strapi is running. Follow the steps found in ``src/cms/``
2. Copy ``.env.example`` as ``.env``.
  * ```REACT_APP_CMS_BASE_URL=http://localhost:1337``` must be set. Be sure your Strapi server is actually running on port ``1337``.

## Running local dev server

1. ``yarn``
2. ``yarn start``. This will run Gatsby in development mode.

You are able to create builds by running ``yarn build``.

If you are running gatsby in a VM, you can pin the websocket port in order to allow a forwarding rule to work consistently.  `export INTERNAL_STATUS_PORT=<port number>`
See https://github.com/gatsbyjs/gatsby/blob/247b1dc0441fdade52a5ff7a71de8c9340ee05fd/packages/gatsby/src/commands/develop.ts#L213 for more info.
