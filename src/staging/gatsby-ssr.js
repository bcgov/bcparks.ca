/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/ssr-apis/
 */

// Reduce Gatsby HTML file size by removing inline styles
// see https://kinderas.com/technology/21/08/28/gatsby-stylesheet-over-inline-styles
export const onPreRenderHTML = ({ getHeadComponents }) => {
    if (process.env.NODE_ENV !== "production") return;

    getHeadComponents().forEach((el) => {
        if (el.type === "style" && el.props["data-href"] && el.props["data-identity"] === "gatsby-global-css") {
            el.type = "link";
            el.props.href = el.props["data-href"];
            el.props.rel = "stylesheet";
            el.props.type = "text/css";

            delete el.props["data-href"];
            delete el.props.dangerouslySetInnerHTML;
        }
    });
};