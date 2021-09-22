#!/bin/sh

if [ -n "$REACT_APP_API_BASE_URL" ]; then  
  echo "window.REACT_APP_API_BASE_URL = \"$REACT_APP_API_BASE_URL\";" >> $APP_ROOT/js/env.js
fi

if [ -n "$REACT_APP_CMS_BASE_URL" ]; then  
  echo "window.REACT_APP_CMS_BASE_URL = \"$REACT_APP_CMS_BASE_URL\";" >> $APP_ROOT/js/env.js
fi

if [ -n "$REACT_APP_FRONTEND_BASE_URL" ]; then  
  echo "window.REACT_APP_FRONTEND_BASE_URL = \"$REACT_APP_FRONTEND_BASE_URL\";" >> $APP_ROOT/js/env.js
fi

if [ -n "$REACT_APP_KEYCLOAK_AUTH_URL" ]; then  
  echo "window.REACT_APP_KEYCLOAK_AUTH_URL = \"$REACT_APP_KEYCLOAK_AUTH_URL\";" >> $APP_ROOT/js/env.js
fi

if [ -n "$REACT_APP_KEYCLOAK_REALM" ]; then  
  echo "window.REACT_APP_KEYCLOAK_REALM = \"$REACT_APP_KEYCLOAK_REALM\";" >> $APP_ROOT/js/env.js
fi

if [ -n "$REACT_APP_KEYCLOAK_CLIENT_ID" ]; then  
  echo "window.REACT_APP_KEYCLOAK_CLIENT_ID = \"$REACT_APP_KEYCLOAK_CLIENT_ID\";" >> $APP_ROOT/js/env.js
fi

if [ -n "$REACT_APP_STAT_HOLIDAY_API" ]; then  
  echo "window.REACT_APP_STAT_HOLIDAY_API = \"$REACT_APP_STAT_HOLIDAY_API\";" >> $APP_ROOT/js/env.js
fi

caddy run --config /etc/caddy/Caddyfile --adapter caddyfile