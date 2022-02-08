# BC Parks CMS

[![Lifecycle:Experimental](https://img.shields.io/badge/Lifecycle-Experimental-339999)](<Redirect-URL>)

## Summary

A data driven progressive mobile web site that provides potential BC Park visitors with information on provincial parks, conservation areas, and ecological reserves.  Content on these pages includes descriptions, activities, amenities, park status, etc.

## Links

The application can be accessed using the links below:

Prod | Test | Dev
--- | --- | ---
[Staff App](https://staff.bcparks.ca)                  | [Test - Staff App](https://test-staff.bcparks.ca)                  | [Dev - Staff App](https://dev-staff.bcparks.ca)                   |
[Public](https://beta.bcparks.ca)                      | [Test - Public](https://test-beta.bcparks.ca)                      | [Dev - Public](https://dev-beta.bcparks.ca)                       |
[CMS](https://cms.bcparks.ca)                          | [Test - CMS](https://test-cms.bcparks.ca)                          | [Dev - CMS](https://dev-cms.bcparks.ca)                           |
[API Docs](https://cms.bcparks.ca/documentation)       | [Test - API Docs](https://test-cms.bcparks.ca/documentation)       | [Dev - API Docs](https://dev-cms.bcparks.ca/documentation)        |
[Sample API endpoint](https://cms.bcparks.ca/urgencies)| [Test - Sample API Endpoint](https://test-cms.bcparks.ca/urgencies)| [Dev - Sample API Endpoint](https://dev-cms.bcparks.ca/urgencies) |
[GraphQL](https://cms.bcparks.ca/graphql)              | [Test - GraphQL](https://test-cms.bcparks.ca/graphql)              | [Dev - GraphQL](https://dev-cms.bcparks.ca/graphql)               |

## Styling Guidelines

--- CMS Content:

Use Bootstrap - Bootstrap classes are applied to both the CMS and public website, so these are the best classes to use in CMS content, allowing editors to better preview the content layout. In particular, use Bootstrap for responsive layout, and basic spacing and sizing. Target Bootstrap 4.

CMS Snippets - A collection of html snippets for custom layout elements, such as stylized buttons, will be maintained at the slug "/cms-snippets" for handy re-use. Any custom (non-bootstrap) classes used here should have a cms- prefix so they can be quickly identified and maintained separately from other global classes eg. class="cms-advisory-link" which should be maintained in the styles/cmsSnippets folder.

Note that changing cms- classes may have non-obvious effects on CMS content. Avoid making changes to cms- classes. If an adjustment is needed in a specific case, consider adding a --variation of a class to capture that case.

Miscellaneous Global Styles - Avoid using classes in CMS content that are defined in the app but are not Bootstrap or cms- classes. Using classes that are globally defined, or in a css file for a particular page, can be very dangerous as a dev editing a styling rule may not realize their change will apply to CMS content, as well as their target elements. 

--- Non-CMS Content:

React component styling - For elements that are specific to component views, define those styles in component-specific scss files, and use nested defnitions to give styles for subelements a narrow scope. Avoid putting component-specific styles in global stylesheets where naming and rule conflicts are more likely.

Use Bootstrap Components - Use Bootstrap component libraries where possible, and replace MUI components with Bootstrap equivalents as you work, ultimately removing MUI altogether. 

Use Bootstrap Classes - When appropriate, and when it aids in readability. In particular, use Bootstrap for responsive layout.

Page Styling - For styling that is specific to different pages (e.g. home, alerts) or page templates (e.g. staticLanding) keep styles within scss files that are specific to, and only loaded by, those pages and templates.

-- General:
Font sizing - Use rem units for font sizes
Icons - Use FontAwesome icons e.g class="fa fa-warning" (and not MUI icons)
BEM - When appropriate, help your fellow dev by using BEM naming conventions to indicate when a class is a --variation or a __subelement.
Scss - When appropriate, use Scss to aid in readability and to narrow the scope of contextual styling rules. Use variables for globals like brand colors and fonts, and only define those once, when possible.
Global - Only place truly global styles in global.scss
