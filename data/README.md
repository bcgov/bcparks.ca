#PURPOSE

The accompanying JSON file is a result of a scripted site scrape of the BCParks.ca sitemap for static content(excluding park details). As previously mentioned this does not include park details as that was covered in a separate body of work. The payload for each page record includes:

- url
- title
- meta
  - keywords
  - title
  - description
- slug
- mainContent(HTML identified as being contained in #mainCol of each document)
- sideContent(HTML identified as being contained in #rightCol of each document, some pages have this nested in #mainCol)
- fullHtmlResponse(dumped the full HTML page incase things were missed in transform stage, this will ensure we do not need to perform another site-wide scrape)

This data was used to create the pages.json content located in `/src/cms/data`. The list does not include forms or redirects.
