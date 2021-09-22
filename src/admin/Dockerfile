FROM image-registry.apps.silver.devops.gov.bc.ca/61d198-tools/caddy:latest

ENV APP_ROOT=/usr/share/caddy
ENV XDG_CONFIG_HOME=/tmp/config

ADD Caddyfile /etc/caddy/Caddyfile
COPY entrypoint.sh /entrypoint.sh

COPY build/. $APP_ROOT/

RUN chmod +x /entrypoint.sh

# Fix permissions
RUN chgrp -R 0 $APP_ROOT && chmod -R g=u $APP_ROOT

EXPOSE 3000

USER 1001

CMD ["/entrypoint.sh"]