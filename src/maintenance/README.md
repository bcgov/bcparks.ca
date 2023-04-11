# Static Maintenance Page

This is a static maintenance page to be used for openShift outages. To activate the maintenance page, edit the 
`vanity-bcparks.ca` route to use the `main-maintenance` service. Change the service back to `main-public` to turn 
off the maintenace page.

## Development

This is a simple HTML and CSS page, so no extra tooling is needed for development.

The `index.html` file can be open directly in browser or using a hot reload server like `live-server`.
