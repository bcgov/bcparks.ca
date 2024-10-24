import "@bcgov/bootstrap-theme/dist/css/bootstrap-theme.min.css"
import "@bcgov/bc-sans/css/BC_Sans.css"
import "jquery/dist/jquery.slim"
import "bootstrap/dist/js/bootstrap.bundle"
import "@fortawesome/fontawesome-free/css/all.min.css"
import "./src/styles/style.scss"

export const onRouteUpdate = ({ location, prevLocation }) => {
  if (typeof window.snowplow === 'function') {
    window.snowplow("trackPageView");
    // refresh snowplow link click tracking to pick up new links
    window.snowplow("refreshLinkClickTracking");
  }
  sessionStorage.setItem("prevPath", prevLocation ? prevLocation.pathname : null);
};

// work-around for gatsby issue -- fix scroll restoration
// see https://github.com/gatsbyjs/gatsby/issues/38201#issuecomment-1658071105
export const shouldUpdateScroll = ({ routerProps: { location }, getSavedScrollPosition }) => {
  if (!window.location.hash) {
    window.history.scrollRestoration = 'manual';
    const currentPosition = getSavedScrollPosition(location, location.key);
    // minimum timeout needs to be somewhat greater than zero the avoid map loading
    // interferance on park pages
    let timeout = 100;
    // use a longer timeout for longer pages so they can finish rendering first
    if (currentPosition && currentPosition.length > 1 && currentPosition[1]) {
      const y = currentPosition[1];
      if (y > (2 * window.innerHeight)) {
        timeout = 750;
      }
    }
    setTimeout(() => {
      window.scrollTo(...(currentPosition || [0, 0]));
    }, timeout);
  }
  return location.hash?.length > 0;
};