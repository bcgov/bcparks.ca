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
            {
                "/explore/misc/bears/bearbowr.html",
                "/plan-your-trip/visit-responsibly/wildlife-safety"
            },
            {
                "/explore/misc/bears/index.html",
                "/plan-your-trip/visit-responsibly/wildlife-safety"
            },
            {
                "/explore/misc/wolves/index.html",
                "/plan-your-trip/visit-responsibly/wildlife-safety"
            },
            { "/explore/parks/", "/find-a-park" },
            { "/fees/", "/reservations/camping-fees" },
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
            { "/reserve/frontcountry-camping/", "/reservations/frontcountry-camping" },
            { "/reserve/garibaldi/", "/reservations/backcountry-camping/garibaldi" },
            { "/reserve/group-camping/", "/reservations/group-camping" },
            { "/reserve/joffre-lakes/", "/reservations/backcountry-camping/joffre-lakes" },
            { "/reserve/mt-assiniboine/", "/reservations/backcountry-camping/mount-assiniboine" },
            { "/reserve/picnic-shelter/", "/reservations/picnic-shelters" },
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
            // mappings from sub-page slugs
            { "nat_cul.html", "nature-and-culture" },
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
            { "hikecamp.html", "camp-hike" }
        };

    public static string Process(string input, bool isParkSubpage = false)
    {
        input = input.Trim();
        input = UnderlineToUtf8(input);

        // update these links for easier matching later
        input = input.Replace("../../../planning/", "/planning/");

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
            });

        input = htmlDoc.DocumentNode.OuterHtml;

        // parse the html again with AngleSharp
        var nodes = GetNodes(input);

        if (!isParkSubpage)
        {
            // remove images
            var images = nodes.QuerySelectorAll("img");
            foreach (var img in images)
            {
                img.Remove();
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

        // add a "legacy-link" class to all html anchors
        var links = nodes.QuerySelectorAll("a");
        foreach (var link in links)
        {
            var href = (link.GetAttribute("href") ?? "").ToLower();
            var hash = "";
            if (href.Split("#").Length > 1)
            {
                hash = href.Split("#")[1];
                href = href.Split("#")[0];
            }

            if (href.StartsWith("/accessibility/parks/"))
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
            // remove photo page links
            else if (href.StartsWith("photos"))
            {
                link.Remove();
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

        // manual string cleanup
        var html = nodes.ToHtml();

        html = html.Replace("\t", " ");
        while (html.Contains("  "))
        {
            html = html.Replace("  ", " ");
        }

        // format the html nicely
        var pretty = GetNodes(html).Prettify();

        // remove empty div tags
        pretty = pretty.Replace("<div>\n</div>", "");

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

    public static string UnderlineToUtf8(string input)
    {
        return input
            .Replace("<u>a</u>", "a̲")
            .Replace("<u>b</u>", "b̲")
            .Replace("<u>c</u>", "c̲")
            .Replace("<u>d</u>", "d̲")
            .Replace("<u>e</u>", "e̲")
            .Replace("<u>f</u>", "f̲")
            .Replace("<u>g</u>", "g̲")
            .Replace("<u>h</u>", "h̲")
            .Replace("<u>i</u>", "i̲")
            .Replace("<u>j</u>", "j̲")
            .Replace("<u>k</u>", "k̲")
            .Replace("<u>l</u>", "l̲")
            .Replace("<u>m</u>", "m̲")
            .Replace("<u>n</u>", "n̲")
            .Replace("<u>o</u>", "o̲")
            .Replace("<u>p</u>", "p̲")
            .Replace("<u>q</u>", "q̲")
            .Replace("<u>r</u>", "r̲")
            .Replace("<u>s</u>", "s̲")
            .Replace("<u>t</u>", "t̲")
            .Replace("<u>u</u>", "u̲")
            .Replace("<u>v</u>", "v̲")
            .Replace("<u>w</u>", "w̲")
            .Replace("<u>x</u>", "x̲")
            .Replace("<u>y</u>", "y̲")
            .Replace("<u>z</u>", "z̲")
            .Replace("<u>A</u>", "A̲")
            .Replace("<u>B</u>", "B̲")
            .Replace("<u>C</u>", "C̲")
            .Replace("<u>D</u>", "D̲")
            .Replace("<u>E</u>", "E̲")
            .Replace("<u>F</u>", "F̲")
            .Replace("<u>G</u>", "G̲")
            .Replace("<u>H</u>", "H̲")
            .Replace("<u>I</u>", "I̲")
            .Replace("<u>J</u>", "J̲")
            .Replace("<u>K</u>", "K̲")
            .Replace("<u>L</u>", "L̲")
            .Replace("<u>M</u>", "M̲")
            .Replace("<u>N</u>", "N̲")
            .Replace("<u>O</u>", "O̲")
            .Replace("<u>P</u>", "P̲")
            .Replace("<u>Q</u>", "Q̲")
            .Replace("<u>R</u>", "R̲")
            .Replace("<u>S</u>", "S̲")
            .Replace("<u>T</u>", "T̲")
            .Replace("<u>U</u>", "U̲")
            .Replace("<u>V</u>", "V̲")
            .Replace("<u>W</u>", "W̲")
            .Replace("<u>X</u>", "X̲")
            .Replace("<u>Y</u>", "Y̲")
            .Replace("<u>Z</u>", "Z̲")
            .Replace("<u>a</u>", "a̲")
            .Replace("<u>b</u>", "b̲")
            .Replace("<u>c</u>", "c̲")
            .Replace("<u>d</u>", "d̲")
            .Replace("<u>e</u>", "e̲")
            .Replace("<u>f</u>", "f̲")
            .Replace("<u>g</u>", "g̲")
            .Replace("<u>h</u>", "h̲")
            .Replace("<u>i</u>", "i̲")
            .Replace("<u>j</u>", "j̲")
            .Replace("<u>k</u>", "k̲")
            .Replace("<u>l</u>", "l̲")
            .Replace("<u>m</u>", "m̲")
            .Replace("<u>n</u>", "n̲")
            .Replace("<u>o</u>", "o̲")
            .Replace("<u>p</u>", "p̲")
            .Replace("<u>q</u>", "q̲")
            .Replace("<u>r</u>", "r̲")
            .Replace("<u>s</u>", "s̲")
            .Replace("<u>t</u>", "t̲")
            .Replace("<u>u</u>", "u̲")
            .Replace("<u>v</u>", "v̲")
            .Replace("<u>w</u>", "w̲")
            .Replace("<u>x</u>", "x̲")
            .Replace("<u>y</u>", "y̲")
            .Replace("<u>z</u>", "z̲")
            .Replace("<u>A</u>", "A̲")
            .Replace("<u>B</u>", "B̲")
            .Replace("<u>C</u>", "C̲")
            .Replace("<u>D</u>", "D̲")
            .Replace("<u>E</u>", "E̲")
            .Replace("<u>F</u>", "F̲")
            .Replace("<u>G</u>", "G̲")
            .Replace("<u>H</u>", "H̲")
            .Replace("<u>I</u>", "I̲")
            .Replace("<u>J</u>", "J̲")
            .Replace("<u>K</u>", "K̲")
            .Replace("<u>L</u>", "L̲")
            .Replace("<u>M</u>", "M̲")
            .Replace("<u>N</u>", "N̲")
            .Replace("<u>O</u>", "O̲")
            .Replace("<u>P</u>", "P̲")
            .Replace("<u>Q</u>", "Q̲")
            .Replace("<u>R</u>", "R̲")
            .Replace("<u>S</u>", "S̲")
            .Replace("<u>T</u>", "T̲")
            .Replace("<u>U</u>", "U̲")
            .Replace("<u>V</u>", "V̲")
            .Replace("<u>W</u>", "W̲")
            .Replace("<u>X</u>", "X̲")
            .Replace("<u>Y</u>", "Y̲")
            .Replace("<u>Z</u>", "Z̲")
            .Replace("<sup>a</sup>", "ᵃ")
            .Replace("<sup>b</sup>", "ᵇ")
            .Replace("<sup>c</sup>", "ᶜ")
            .Replace("<sup>d</sup>", "ᵈ")
            .Replace("<sup>e</sup>", "ᵉ")
            .Replace("<sup>f</sup>", "ᶠ")
            .Replace("<sup>g</sup>", "ᵍ")
            .Replace("<sup>h</sup>", "ʰ")
            .Replace("<sup>i</sup>", "ⁱ")
            .Replace("<sup>j</sup>", "ʲ")
            .Replace("<sup>k</sup>", "ᵏ")
            .Replace("<sup>l</sup>", "ˡ")
            .Replace("<sup>m</sup>", "ᵐ")
            .Replace("<sup>n</sup>", "ⁿ")
            .Replace("<sup>o</sup>", "ᵒ")
            .Replace("<sup>p</sup>", "ᵖ")
            .Replace("<sup>r</sup>", "ʳ")
            .Replace("<sup>s</sup>", "ˢ")
            .Replace("<sup>t</sup>", "ᵗ")
            .Replace("<sup>u</sup>", "ᵘ")
            .Replace("<sup>v</sup>", "ᵛ")
            .Replace("<sup>w</sup>", "ʷ")
            .Replace("<sup>x</sup>", "ˣ")
            .Replace("<sup>y</sup>", "ʸ")
            .Replace("<sup>z</sup>", "ᶻ")
            .Replace("<sup>A</sup>", "ᴬ")
            .Replace("<sup>B</sup>", "ᴮ")
            .Replace("<sup>C</sup>", "ꟲ")
            .Replace("<sup>D</sup>", "ᴰ")
            .Replace("<sup>E</sup>", "ᴱ")
            .Replace("<sup>F</sup>", "ꟳ")
            .Replace("<sup>G</sup>", "ᴳ")
            .Replace("<sup>H</sup>", "ᴴ")
            .Replace("<sup>I</sup>", "ᴵ")
            .Replace("<sup>J</sup>", "ᴶ")
            .Replace("<sup>K</sup>", "ᴷ")
            .Replace("<sup>L</sup>", "ᴸ")
            .Replace("<sup>M</sup>", "ᴹ")
            .Replace("<sup>N</sup>", "ᴺ")
            .Replace("<sup>O</sup>", "ᴼ")
            .Replace("<sup>P</sup>", "ᴾ")
            .Replace("<sup>Q</sup>", "ꟴ")
            .Replace("<sup>R</sup>", "ᴿ")
            .Replace("<sup>T</sup>", "ᵀ")
            .Replace("<sup>U</sup>", "ᵁ")
            .Replace("<sup>V</sup>", "ⱽ")
            .Replace("<sup>W</sup>", "ᵂ");
    }
}
