using System.Text.RegularExpressions;
using AngleSharp.Dom;
using BCParks.ScrapeTools.Shared;
using BCParks.ScrapeTools.Shared.Serialization;
using Newtonsoft.Json;

namespace BCParks.ScrapeTools.ParkSubPages;

internal class Program
{
    private static async Task Main(string[] args)
    {
        var dataPath = PathUtils.GetDataPath();
        var rawJson = await File.ReadAllTextAsync($@"{dataPath}\park-urls.json");
        var parkSubpages = new ParkSubpages();

        var urls = JsonConvert.DeserializeObject<ParkUrls>(rawJson).Items.ToList();
        var count = 0;

        foreach (var url in urls)
        {
            if (url.orcs == "18")
            {
                // skip tweedsmuir park north (Repealed status)
                continue;
            }

            var client = new HttpClient();
            var indexPageContent = await client
                .GetAsync(url.oldUrl)
                .Result.Content.ReadAsStringAsync();

            var uniqueList = new HashSet<string>();

            // parse the html with AngleSharp
            var indexPageNodes = HtmlCleanup.GetNodes(indexPageContent);

            var links = indexPageNodes.QuerySelectorAll("a");
            foreach (var anchor in links)
            {
                var linkHref = (anchor.GetAttribute("href") ?? "").ToLower();
                linkHref = linkHref.Replace(url.oldUrl, "");

                if (
                    linkHref.Contains(".htm")
                    && !linkHref.StartsWith("photos")
                    && !linkHref.StartsWith("#")
                    && !linkHref.StartsWith("http")
                    && !linkHref.StartsWith("..")
                    && !linkHref.StartsWith("?")
                    && !linkHref.StartsWith("/")
                    && !linkHref.StartsWith("mailto")
                    && !linkHref.StartsWith("area_maps")
                    && !(linkHref == "h/bcparks/explore/fishreg.html#hunting")
                    && !string.IsNullOrWhiteSpace(linkHref)
                    && !linkHref.Equals("park_map.html")
                    && !linkHref.EndsWith("_form.html")
                )
                {
                    uniqueList.Add(linkHref.Split("#")[0].Trim());
                }
            }

            foreach (var page in uniqueList)
            {
                var subpageUrl = url.oldUrl + page;

                Console.WriteLine(url.orcs + "," + subpageUrl);

                // get the subpage from the web server
                var result = client.GetAsync(subpageUrl).Result;

                // skip to the next item if the request failed
                if (!result.IsSuccessStatusCode)
                {
                    continue;
                }

                var subPageContent = await result.Content.ReadAsStringAsync();
                var subPageNodes = HtmlCleanup.GetNodes(subPageContent);

                var titleText = "";
                var title = subPageNodes.QuerySelectorAll("title");

                if (title.Length > 0)
                {
                    titleText = title[0].InnerHtml;
                }

                RemoveById(subPageNodes, "#addThis");
                RemoveById(subPageNodes, "#breadcrumbs");
                RemoveById(subPageNodes, "#alphaList");

                var heading = "";

                var content = subPageNodes.QuerySelectorAll("#mainCol");

                if (content.Length > 0)
                {
                    var h1 = content[0].QuerySelectorAll("h1");

                    if (h1.Length > 0)
                    {
                        heading = HtmlCleanup.Process(h1[0].InnerHtml);
                        h1[0].Remove();
                    }
                    else
                    {
                        var h2 = content[0].QuerySelectorAll("h2");

                        if (h2.Length > 0)
                        {
                            heading = HtmlCleanup.Process(h2[0].InnerHtml);
                            h2[0].Remove();
                        }
                    }
                }

                var html = "";

                if (content.Length > 0)
                {
                    html = HtmlCleanup.Process(content[0].InnerHtml, true);
                }

                parkSubpages.Items.Add(
                    new ParkSubpage
                    {
                        orcs = url.orcs,
                        oldUrl = subpageUrl,
                        slug = page.Split(".")[0]
                            .Replace("nat_cul", "nature-culture")
                            .Replace("hikeski", "hike-ski")
                            .Replace("horseuse", "horse-use")
                            .Replace("faqs/index", "faqs")
                            .Replace("frocamp", "frontcountry-camping")
                            .Replace("campfish", "camp-fish")
                            .Replace("fishhunt", "fish-hunt")
                            .Replace("camphike", "camp-hike")
                            .Replace("hikecamp", "camp-hike")
                            .Replace("shmar23", "site-list")
                            .Replace("_", "-"),
                        content = html,
                        heading = CleanupTitle(heading),
                        title =
                            titleText == "BC Parks - Province of British Columbia"
                            || titleText == "Visiting - BC Parks - Province of British Columbia"
                                ? CleanupTitle(heading)
                                : CleanupTitle(titleText)
                    }
                );
                count++;
            }
        }

        parkSubpages.Items = parkSubpages.Items
            .OrderBy(i => int.Parse(i.orcs))
            .ThenBy(i => i.slug)
            .ToList();

        var newFilePath = $@"{dataPath}\park-sub-pages.json";
        JsonUtils.WriteProcessedFile(parkSubpages, newFilePath);
        Console.WriteLine(count + " park sub-pages were found.");
    }

    private static void RemoveById(INodeList subPageNodes, string removeId)
    {
        if (subPageNodes.QuerySelectorAll(removeId).Length > 0)
        {
            subPageNodes.QuerySelectorAll(removeId)[0].Remove();
        }
    }

    private static string CleanupTitle(string titleText)
    {
        titleText = Regex.Replace(titleText, @"\s+", " ");
        return titleText
            .Replace(" - Province of British Columbia", "")
            .Replace("Ministry of Environment, ", "")
            .Replace("Ministry of Environment - ", "")
            .Replace(" - BC Parks", "")
            .Replace("BC Parks - ", "")
            .Replace(" Provincial Park", " Park");
    }
}
