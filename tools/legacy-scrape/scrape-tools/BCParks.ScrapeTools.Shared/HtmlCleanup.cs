using AngleSharp;
using AngleSharp.Dom;
using AngleSharp.Html.Parser;
using HtmlAgilityPack;

namespace BCParks.ScrapeTools.Shared;

public static class HtmlCleanup
{
    public static string Process(string input, bool removeImages = true)
    {
        input = input.Trim();

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
            });

        input = htmlDoc.DocumentNode.OuterHtml;

        // parse the html again with AngleSharp
        var nodes = GetNodes(input);

        if (removeImages)
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

        // add a "legacy-link" class to all html anchors
        var links = nodes.QuerySelectorAll("a");
        foreach (var link in links)
        {
            var href = (link.GetAttribute("href") ?? "").ToLower();
            // planning is a very common link and it will exist on the new site
            if (href == "/planning/")
            {
                break;
            }

            // remove photo page links
            if (href.StartsWith("photos"))
            {
                link.Remove();
            }
            // don't add the class to absolute urls or anchor links
            else if (
                !href.StartsWith("http")
                && !href.StartsWith("#")
                && !href.StartsWith("mailto")
                && !string.IsNullOrWhiteSpace(href)
            )
            {
                link.ClassList.Add("legacy-link");
            }
            else if (href.StartsWith("#"))
            {
                link.OuterHtml = link.InnerHtml;
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
}
