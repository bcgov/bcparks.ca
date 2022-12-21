using AngleSharp;
using AngleSharp.Dom;
using AngleSharp.Html.Parser;
using HtmlAgilityPack;

namespace BCParks.ScrapeTools.Shared;

public static class HtmlCleanup
{
    private static readonly Dictionary<string, string> pageMapping =
        new()
        {
            // mappings from the spreadsheet
            // https://bcgov.sharepoint.com/:x:/r/teams/031072/Shared%20Documents/%5BProduct%5D%20bcparks.ca%20(CMS)/Content/Content%20Migration/bc%20parks%20url%20mapping%20legacy%20to%20beta.xlsx?d=w8b36874d9ffe4b69aac14e14abc95504&csf=1&web=1&e=FXC7r7
            { "/", "/" },
            { "/about/", "/about/" },
            { "/about/facts-figures.html", "/about/facts-figures" },
            { "/about/history.html", "/about/history" },
            { "/about/history/", "/about/history" },
            { "/about/legislation.html", "/about/legislation" },
            { "/about/mandate.html", "/about/mandate" },
            { "/about/park-designations.html", "/about/types-parks-protected-areas" },
            { "/accessibility/", "https://accessibility.bcparks.ca" },
            { "/conserve/", "/conservation" },
            { "/conserve/bearconf.html", "/about/news-publications#page-section-389" },
            { "/conserve/climate_change/", "/conservation/climate-change" },
            { "/conserve/con_broch.html", "/about/news-publications#page-section-389" },
            { "/conserve/con_info.html", "/conservation/resources" },
            { "/conserve/impact/", "/conservation/impact-assessment-process" },
            {
                "/conserve/impact/guidance/",
                "/conservation/impact-assessment-process/guidelines-for-external-proponents"
            },
            {
                "/conserve/impact/non-reviewable-actions/",
                "/conservation/impact-assessment-process/non-reviewable-actions"
            },
            { "/conserve/invasive-species/", "/conservation/invasive-species" },
            { "/discover/", "/plan-your-trip" },
            { "/eco_reserve/", "/about/types-parks-protected-areas/ecological-reserves" },
            { "/eco_reserve/alphalist.html", "/find-a-park" },
            { "/education/", "/plan-your-trip/things-to-do/education" },
            { "/education/booklets/", "/plan-your-trip/things-to-do/education#page-section-183" },
            {
                "/education/jerrys-rangers/",
                "/plan-your-trip/things-to-do/education#page-section-183"
            },
            {
                "/education/kids-and-families/",
                "/plan-your-trip/things-to-do/education#page-section-183"
            },
            {
                "/education/park-visitors/",
                "/plan-your-trip/things-to-do/education#page-section-182"
            },
            { "/education/teachers/", "/plan-your-trip/things-to-do/education#page-section-184" },
            { "/employment/", "/about/careers" },
            { "/employment/ranger/", "/about/careers/park-ranger" },
            { "/employment/ranger/careers/", "/about/careers/park-ranger" },
            { "/employment/student-ranger/", "/about/careers/student-rangers" },
            { "/explore/", "/find-a-park" },
            { "/explore/fac_search_df.html", "/find-a-park" },
            { "/explore/index.html", "/find-a-park" },
            { "/explore/links.html", "/find-a-park" },
            {
                "/explore/map.html",
                "https://governmentofbc.maps.arcgis.com/apps/webappviewer/index.html?id=077ef73a1eae4ca88f2bafbb831215af&query=British_Columbia_Parks_Ecological_Reserves_and_Protected_Areas_8747,ORCS_PRIMARY,0000"
            },
            { "/misc/bears/bearbowr.html", "/plan-your-trip/visit-responsibly/wildlife-safety" },
            {
                "/explore/misc/bears/bearbowr.html",
                "/plan-your-trip/visit-responsibly/wildlife-safety"
            },
            { "/misc/bears/", "/plan-your-trip/visit-responsibly/wildlife-safety" },
            { "/explore/misc/bears/", "/plan-your-trip/visit-responsibly/wildlife-safety" },
            {
                "/explore/misc/bears/index.html",
                "/plan-your-trip/visit-responsibly/wildlife-safety"
            },
            {
                "/explore/misc/wolves/index.html",
                "/plan-your-trip/visit-responsibly/wildlife-safety"
            },
            {
                "/explore/misc/wolves/wolfsaf.html",
                "/plan-your-trip/visit-responsibly/wildlife-safety"
            },
            { "/explore/parks/", "/find-a-park" },
            { "/fees/", "/reservations/camping-fees" },
            { "/fees/fees.html", "/reservations/camping-fees" },
            { "/fees/index.html", "/reservations/camping-fees" },
            { "/fees/disability.html", "/reservations/camping-fees#page-section-219" },
            { "/fees/senior.html", "/reservations/camping-fees#page-section-218" },
            { "/fees/youth-groups.html", "/reservations/camping-fees#page-section-217" },
            { "/fixed_roof/", "/commercial-use/policies/fixed-roof" },
            { "/freshet/", "/alerts/" },
            { "/geocaching/", "/commercial-use/policies/geocaching" },
            { "/get-involved/", "/get-involved" },
            { "/info/feedback/", "/contact" },
            { "/learn-more/", "/about" },
            { "/licence-plates/", "/get-involved/buy-licence-plate" },
            {
                "/naturequest/",
                "https://nrs.objectstore.gov.bc.ca/kuwyyf/jerry_nature_quest_2019_fadec9cfe7.pdf"
            },
            { "/news/", "/about/news-publications" },
            { "/operations/park-operators/", "/about/careers/park-operators" },
            { "/partnerships/", "/get-involved/donate" },
            { "/partnerships/conservation.html", "/get-involved/donate" },
            {
                "/partnerships/landAcquisition-story.html",
                "/get-involved/donate/land#page-section-290"
            },
            { "/partnerships/landAcquisition.html", "/get-involved/donate/land" },
            {
                "/partnerships/landAcquisitionMultiPartner.html",
                "/get-involved/donate/land#page-section-288"
            },
            {
                "/partnerships/landAcquisitionPartnerships.html",
                "/get-involved/donate/land#page-section-289"
            },
            { "/partnerships/living-labs/", "/conservation/living-lab-program" },
            {
                "/partnerships/living-labs/research-projects/2017-18/",
                "/conservation/living-lab-program/2017-21-research-projects"
            },
            {
                "/partnerships/living-labs/research-projects/2018-19/",
                "/conservation/living-lab-program/2017-21-research-projects"
            },
            {
                "/partnerships/living-labs/research-projects/2019-20/",
                "/conservation/living-lab-program/2017-21-research-projects"
            },
            {
                "/partnerships/living-labs/research-projects/2020-21/",
                "/conservation/living-lab-program/2017-21-research-projects"
            },
            {
                "/partnerships/living-labs/research-projects/2021-22/",
                "/conservation/living-lab-program/2021-22-research-projects"
            },
            {
                "/partnerships/living-labs/research-themes/",
                "/conservation/living-lab-program/research-themes-priority-projects"
            },
            { "/partnerships/ltem/", "/conservation/long-term-ecological-monitoring-program" },
            {
                "/partnerships/ltem/biomes.html",
                "/conservation/long-term-ecological-monitoring-program#page-section-350"
            },
            {
                "/partnerships/ltem/data.html",
                "/conservation/long-term-ecological-monitoring-program#page-section-349"
            },
            { "/partnerships/pef.html", "/get-involved/donate#page-section-15" },
            { "/partnerships/sponsorship/", "/get-involved/donate" },
            { "/PBAProcess/", "/about/park-management-plans/boundary-adjustment-guidelines" },
            { "/permits/", "/commercial-use/policies" },
            {
                "/permits/consultation/public-notifications-policy.html",
                "/commercial-use/public-notification-commercial-permits"
            },
            {
                "/permits/consultation/research-policy.html",
                "/commercial-use/policies/research-permit"
            },
            {
                "/permits/consultation/ski-resort-policy.html",
                "/commercial-use/policies/ski-resort"
            },
            { "/permits/film/", "/commercial-use/filming-in-parks" },
            { "/permits/parks-use-permit-info.html", "/commercial-use/permit-information" },
            { "/permits/permission_overview.html", "/commercial-use/permit-information" },
            { "/planning/", "/about/park-management-plans" },
            { "/planning/mgmtplns/", "/about/park-management-plans" },
            { "/planning/process/index.html", "/about/park-management-plans/planning-process" },
            { "/policy/", "/commercial-use/policies" },
            { "/promo/bcparks_brochures.html", "/about/news-publications" },
            { "/publications/", "/about/news-publications" },
            { "/recreation/biking-in-bc/", "/plan-your-trip/things-to-do/cycling" },
            { "/recreation/biking/", "/plan-your-trip/things-to-do/cycling" },
            { "/recreation/canoeing/", "/plan-your-trip/things-to-do/canoeing-kayaking" },
            { "/recreation/fishing/", "/plan-your-trip/things-to-do/freshwater-fishing" },
            { "/recreation/hiking/", "/plan-your-trip/things-to-do/hiking" },
            { "/recreation/marine_parks/", "/plan-your-trip/things-to-do/marine-recreation" },
            { "/recreation/winter-activities/", "/plan-your-trip/things-to-do/winter-activities" },
            { "/registration/", "/reservations/backcountry-camping/permit-registration" },
            { "/research/", "/about/news-publications/reports-surveys" },
            { "/reserve/", "/reservations" },
            { "/reserve/berg-lake-trail/", "/reservations/backcountry-camping/berg-lake-trail" },
            {
                "/reserve/bowron-lake/",
                "/reservations/backcountry-camping/bowron-lake-canoe-circuit"
            },
            { "/reserve/day-use/", "/reservations/day-use-passes" },
            { "/reserve/frontcountry.html", "/reservations/frontcountry-camping" },
            { "/reserve/frontcountry-camping/", "/reservations/frontcountry-camping" },
            { "/reserve/garibaldi/", "/reservations/backcountry-camping/garibaldi" },
            { "/reserve/group.html", "/reservations/group-camping" },
            { "/reserve/group-camping/", "/reservations/group-camping" },
            { "/reserve/joffre-lakes/", "/reservations/backcountry-camping/joffre-lakes" },
            { "/reserve/mt-assiniboine/", "/reservations/backcountry-camping/mount-assiniboine" },
            { "/reserve/picnic_shelter.html", "/reservations/picnic-shelters" },
            { "/reserve/picnic-shelter/", "/reservations/picnic-shelters" },
            { "/reserve/dc_refund_guidelines.html", "/reservations/cancellations-refunds" },
            { "/reserve/refunds/", "/reservations/cancellations-refunds" },
            {
                "/reserve/wilderness/",
                "/reservations/backcountry-camping/garibaldi#page-section-244"
            },
            { "/resources/travel-trade/", "/commercial-use/travel-trade" },
            { "/training/invasive-species/", "https://training.bcparks.ca/invasive-species/" },
            { "/visiting/", "/plan-your-trip/things-to-do" },
            {
                "/visiting/backcountry-education/",
                "/plan-your-trip/visit-responsibly/backcountry-guide"
            },
            {
                "/visiting/backcountry-education/module/story_html5.html",
                "https://training.bcparks.ca/backcountry-education"
            },
            {
                "/visiting/backcountry-visitor-guide/",
                "/plan-your-trip/visit-responsibly/backcountry-guide"
            },
            {
                "/visiting/campfire-bans-safety/",
                "/plan-your-trip/visit-responsibly/responsible-recreation#page-section-160"
            },
            {
                "http://www.env.gov.bc.ca/bcparks/explore/fishreg.html",
                "/plan-your-trip/things-to-do/freshwater-fishing"
            },
            { "/explore/fishreg.html", "/plan-your-trip/things-to-do/freshwater-fishing" },
            { "/fishreg.html", "/plan-your-trip/things-to-do/freshwater-fishing" },
            { "/visiting/fish-hunt/", "/plan-your-trip/things-to-do/freshwater-fishing" },
            {
                "/visiting/frontcountry-visitor-guide/",
                "/plan-your-trip/visit-responsibly/camping-day-use-guide#page-section-167"
            },
            {
                "/visiting/marine-visitor-guide/",
                "/plan-your-trip/visit-responsibly/marine-visitor-guide"
            },
            {
                "/visiting/parks-and-drones/",
                "/plan-your-trip/visit-responsibly/responsible-recreation#page-section-166"
            },
            {
                "/visiting/parks-and-pets/",
                "/plan-your-trip/visit-responsibly/responsible-recreation#page-section-163"
            },
            {
                "/visiting/responsible-recreation/",
                "/plan-your-trip/visit-responsibly/responsible-recreation"
            },
            { "/visiting/visitor-safety/", "/plan-your-trip/visit-responsibly/staying-safe" },
            {
                "/explore/gen_info/wild_gen.html",
                "/plan-your-trip/visit-responsibly/wildlife-safety"
            },
            { "/explore/wild_gen.html", "/plan-your-trip/visit-responsibly/wildlife-safety" },
            { "/wild_gen.html", "/plan-your-trip/visit-responsibly/wildlife-safety" },
            { "/visiting/wildlife-safety/", "/plan-your-trip/visit-responsibly/wildlife-safety" },
            { "/visiting/winter-safety/", "/plan-your-trip/visit-responsibly/winter-safety" },
            { "/volunteers/", "/get-involved/volunteer" },
            {
                "/volunteers/about/programs/er-wardens.html",
                "/get-involved/volunteer#page-section-36"
            },
            { "/volunteers/network/", "/get-involved/volunteer#page-section-11" },
            {
                "/volunteers/network/kootenay-okanagan.html",
                "/get-involved/volunteer#page-section-12"
            },
            { "/volunteers/network/multi-area.html", "/get-involved/volunteer#page-section-13" },
            { "/volunteers/network/northern.html", "/get-involved/volunteer#page-section-14" },
            { "/volunteers/network/south-coast.html", "/get-involved/volunteer#page-section-15" },
            {
                "/volunteers/network/thompson-cariboo.html",
                "/get-involved/volunteer#page-section-16"
            },
            { "/volunteers/network/west-coast.html", "/get-involved/volunteer#page-section-17" },
            { "/volunteers/opportunities/", "/get-involved/volunteer" },
            { "/volunteers/recognition/", "/get-involved/volunteer/awards" },
            { "/wildfire/", "/active-advisories/?type=wildfire%20nearby" },
            { "/notrace.html", "https://leavenotrace.ca/" },
            { "/explore/notrace.html", "https://leavenotrace.ca/" },
            { "/explore/safety/", "/plan-your-trip/visit-responsibly/staying-safe" },
            { "/safety/", "/plan-your-trip/visit-responsibly/staying-safe" },
            // mappings from sub-page slugs
            { "nat_cul.html", "nature-culture" },
            { "hiking.html", "hiking" },
            { "trails.html", "trails" },
            { "climbing.html", "climbing" },
            { "canoe.html", "canoe" },
            { "canoeing.html", "canoeing" },
            { "skiing.html", "skiing" },
            { "hikeski.html", "hike-ski" },
            { "horseuse.html", "horse-use" },
            { "faqs/index.html", "faqs" },
            { "frocamp.html", "frontcountry-camping" },
            { "campfish.html", "camp-fish" },
            { "fishhunt.html", "fish-hunt" },
            { "camphike.html", "camp-hike" },
            { "hikecamp.html", "camp-hike" },
            { "shmar23.html", "site-list" }
        };

    public static string Process(string input, bool isParkSubpage = false)
    {
        input = input.Trim();
        input = TagsToEntities(input);

        // parse the html with HtmlAgilityPack
        var htmlDoc = new HtmlDocument();
        htmlDoc.LoadHtml(input);

        // remove html comments
        htmlDoc.DocumentNode
            .Descendants()
            .Where(n => n.NodeType == HtmlNodeType.Comment)
            .ToList()
            .ForEach(n => n.Remove());

        // remove css classes and ids
        htmlDoc.DocumentNode
            .Descendants()
            .ToList()
            .ForEach(n =>
            {
                n.Attributes.Remove("class");
                n.Attributes.Remove("id");
                n.Attributes.Remove("style");
                n.Attributes.Remove("data-lightbox");
                n.Attributes.Remove("data-title");
                n.Attributes.Remove("border");
                n.Attributes.Remove("align");
                n.Attributes.Remove("cellspacing");
                n.Attributes.Remove("cellpadding");
                n.Attributes.Remove("valign");
                n.Attributes.Remove("bordercolor");
                n.Attributes.Remove("bgcolor");

                // remove height and width from tables and images (but keep them on iframes and videos)
                if (
                    n.Name == "table"
                    || n.Name == "col"
                    || n.Name == "td"
                    || n.Name == "th"
                    || n.Name == "img"
                )
                {
                    n.Attributes.Remove("width");
                    n.Attributes.Remove("height");
                }
            });

        input = htmlDoc.DocumentNode.OuterHtml;

        // parse the html again with AngleSharp
        var nodes = GetNodes(input);

        // remove images or add a legacy-image class for park subpages
        var images = nodes.QuerySelectorAll("img");
        foreach (var img in images)
        {
            if (!isParkSubpage)
            {
                img.Remove();
            }
            else
            {
                var src = img.GetAttribute("src") ?? "";
                if (!src.ToLower().StartsWith("http"))
                {
                    img.ClassList.Add("legacy-image");
                }
            }
        }

        // remove scripts
        var scripts = nodes.QuerySelectorAll("script");
        foreach (var script in scripts)
        {
            script.Remove();
        }

        // remove meta tags
        var metaTags = nodes.QuerySelectorAll("meta");
        foreach (var meta in metaTags)
        {
            meta.Remove();
        }

        // remove input tags
        var inputTags = nodes.QuerySelectorAll("input");
        foreach (var inputTag in inputTags)
        {
            inputTag.Remove();
        }

        // remove textarea tags
        var textareaTags = nodes.QuerySelectorAll("textarea");
        foreach (var textareaTag in textareaTags)
        {
            textareaTag.Remove();
        }

        // remove font tags
        var fontTags = nodes.QuerySelectorAll("font");
        foreach (var fontTag in fontTags)
        {
            fontTag.OuterHtml = fontTag.InnerHtml;
        }

        // remove form tags
        var formTags = nodes.QuerySelectorAll("form");
        foreach (var formTag in formTags)
        {
            formTag.OuterHtml = formTag.InnerHtml;
        }

        // remove span tags
        var spanTags = nodes.QuerySelectorAll("span");
        foreach (var spanTag in spanTags)
        {
            spanTag.OuterHtml = spanTag.InnerHtml;
        }

        // add a "legacy-link" class to all html anchors
        var links = nodes.QuerySelectorAll("a");
        foreach (var link in links)
        {
            var href = link.GetAttribute("href") ?? "";
            if (href.StartsWith("http://bcparks.ca"))
            {
                href = href.Replace("http://bcparks.ca", "");
            }

            if (href.StartsWith("https://bcparks.ca"))
            {
                href = href.Replace("https://bcparks.ca", "");
            }

            if (href.StartsWith("http://www.env.gov.bc.ca/bcparks"))
            {
                href = href.Replace("http://www.env.gov.bc.ca/bcparks", "");
            }

            if (href.StartsWith("https://www.env.gov.bc.ca/bcparks"))
            {
                href = href.Replace("https://www.env.gov.bc.ca/bcparks", "");
            }

            if (href.Contains("notrace.html"))
            {
                href = "/notrace.html";
            }

            //  http://www.env.gov.bc.ca/bcparks,

            if (href.Contains("../../../"))
            {
                href = href.Replace("../../../", "/");
            }

            if (href.Contains("../../"))
            {
                href = href.Replace("../../", "/");
            }

            if (href.Contains("/bcaprks"))
            {
                href = href.Replace("/bcaprks", "/bcparks");
            }

            if (href.Contains("/explroe"))
            {
                href = href.Replace("/explroe", "/explore");
            }

            if (href.Contains("/bcparks/explore"))
            {
                href = href.Replace("/bcparks/explore", "/explore");
            }

            var hash = "";
            if (href.Split("#").Length > 1)
            {
                hash = href.Split("#")[1];
                href = href.Split("#")[0];
            }

            href = href.ToLower();

            if (string.IsNullOrEmpty(href) && hash == "top")
            {
                // remove links to #top
                link.Remove();
            }
            else if (href.StartsWith("/accessibility/parks/"))
            {
                link.SetAttribute("href", "https://accessibility.bcparks.ca");
            }
            else if (href.StartsWith("/volunteers/opportunities/"))
            {
                link.SetAttribute("href", "/get-involved/volunteer");
            }
            else if (pageMapping.ContainsKey(href))
            {
                if (!pageMapping[href].Contains("#") && !string.IsNullOrWhiteSpace(hash))
                {
                    // add back the anchor hash if the original url had one and the new URL does not
                    link.SetAttribute("href", $"{pageMapping[href]}#{hash}");
                }
                else
                {
                    link.SetAttribute("href", pageMapping[href]);
                }
            }
            else if (string.IsNullOrWhiteSpace(hash) && pageMapping.ContainsKey(href + "/"))
            {
                if (!pageMapping[href + "/"].Contains("#") && !string.IsNullOrWhiteSpace(hash))
                {
                    // add back the anchor hash if the original url had one and the new URL does not
                    link.SetAttribute("href", $"{pageMapping[href + "/"]}#{hash}");
                }
                else
                {
                    link.SetAttribute("href", pageMapping[href + "/"]);
                }
            }
            // remove photo page links
            else if (href.StartsWith("photos"))
            {
                link.Remove();
            }
            else if (!href.Contains("/") && href.Contains(".html"))
            {
                var slugifiedChildUrl = href.Replace(".html", "")
                    .Replace("_", "-")
                    .Trim()
                    .ToLower();
                link.SetAttribute("href", slugifiedChildUrl);
                // still add the legacy-link class because these require human review
                link.ClassList.Add("legacy-link");
            }
            // don't add the class to absolute urls, mailto links, or named anchors
            else if (
                !href.StartsWith("http")
                && !href.StartsWith("mailto")
                && !string.IsNullOrWhiteSpace(href)
            )
            {
                link.ClassList.Add("legacy-link");
            }
        }

        // add an empty alt tag to any image that is missing an alt tag
        images = nodes.QuerySelectorAll("img");
        foreach (var img in images)
        {
            var alt= img.GetAttribute("alt") ?? "";
            if (string.IsNullOrEmpty(alt))
            {
                img.SetAttribute("alt", "");
            }
        }

        // manual string cleanup
        var html = nodes.ToHtml();

        html = html.Replace("\t", " ");
        while (html.Contains("  "))
        {
            html = html.Replace("  ", " ");
        }

        // format the html nicely
        var pretty = GetNodes(html).Prettify();

        // remove empty div and p tags
        pretty = pretty.Replace("<div>\n</div>", "");
        pretty = pretty.Replace("<p>\n</p>", "");

        // remove leading carriage returns
        while (pretty.StartsWith("\n"))
        {
            pretty = pretty.Substring(1);
        }

        // return the formatted html replacing tabs with 2 spaces
        return pretty.Replace("\t", "  ");
    }

    public static INodeList GetNodes(string fragment)
    {
        var p = new HtmlParser();
        var dom = p.ParseDocument(string.Empty);
        return p.ParseFragment(fragment, dom.Body);
    }

    public static string TagsToEntities(string input)
    {
        for (var i = 65; i <= 90; i++)
        {
            var letter = (char)i;
            input = input.Replace($"<u>{letter}</u>", $"{letter}&#817;");
        }

        for (var i = 97; i <= 122; i++)
        {
            var letter = (char)i;
            input = input.Replace($"<u>{letter}</u>", $"{letter}&#817;");
        }

        return input
            .SupEscape("a", "ᵃ")
            .SupEscape("b", "ᵇ")
            .SupEscape("c", "ᶜ")
            .SupEscape("d", "ᵈ")
            .SupEscape("e", "ᵉ")
            .SupEscape("f", "ᶠ")
            .SupEscape("g", "ᵍ")
            .SupEscape("h", "ʰ")
            .SupEscape("i", "ⁱ")
            .SupEscape("j", "ʲ")
            .SupEscape("k", "ᵏ")
            .SupEscape("l", "ˡ")
            .SupEscape("m", "ᵐ")
            .SupEscape("n", "ⁿ")
            .SupEscape("o", "ᵒ")
            .SupEscape("p", "ᵖ")
            .SupEscape("r", "ʳ")
            .SupEscape("s", "ˢ")
            .SupEscape("t", "ᵗ")
            .SupEscape("u", "ᵘ")
            .SupEscape("v", "ᵛ")
            .SupEscape("w", "ʷ")
            .SupEscape("x", "ˣ")
            .SupEscape("y", "ʸ")
            .SupEscape("z", "ᶻ")
            .SupEscape("A", "ᴬ")
            .SupEscape("B", "ᴮ")
            .SupEscape("C", "ꟲ")
            .SupEscape("D", "ᴰ")
            .SupEscape("E", "ᴱ")
            .SupEscape("F", "ꟳ")
            .SupEscape("G", "ᴳ")
            .SupEscape("H", "ᴴ")
            .SupEscape("I", "ᴵ")
            .SupEscape("J", "ᴶ")
            .SupEscape("K", "ᴷ")
            .SupEscape("L", "ᴸ")
            .SupEscape("M", "ᴹ")
            .SupEscape("N", "ᴺ")
            .SupEscape("O", "ᴼ")
            .SupEscape("P", "ᴾ")
            .SupEscape("Q", "ꟴ")
            .SupEscape("R", "ᴿ")
            .SupEscape("T", "ᵀ")
            .SupEscape("U", "ᵁ")
            .SupEscape("V", "ⱽ")
            .SupEscape("W", "ᵂ");
    }

    public static string SupEscape(this string input, string find, string replace)
    {
        return input.Replace($"<sup>{find}</sup>", $"&#{(int)replace[0]};");
    }
}
