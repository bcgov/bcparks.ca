using Newtonsoft.Json;

namespace BCParks.ScrapeTools.Shared.Serialization;

/// <summary>
///     This is a custom class for writing JSON files in the expected format for the content
///     import tool.
/// </summary>
public class ParkSubpage
{
    public string? orcs { get; set; }
    public string? oldUrl { get; set; }
    public string? slug { get; set; }
    public string? content { get; set; }
    public string? heading { get; set; }
    public string? title { get; set; }
}

public class ParkSubpages
{
    public ParkSubpages()
    {
        Items = new List<ParkSubpage>();
    }

    [JsonProperty("parkSubpages")]
    public List<ParkSubpage> Items { get; set; }
}
