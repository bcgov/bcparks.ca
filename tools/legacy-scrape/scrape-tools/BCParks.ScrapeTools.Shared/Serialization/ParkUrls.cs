using Newtonsoft.Json;

namespace BCParks.ScrapeTools.Shared.Serialization;

/// <summary>
///     This is a custom class for writing JSON files in the expected format for the content
///     import tool. See the corresponding file with the same name in the Deserialization
///     folder converting JSON files exported from the Visitor Service Database into C# objects.
///     There are slight difference in class definitions to achieve the cleanup required.
/// </summary>
public class ParkUrl
{
    public string? orcs { get; set; }
    public string? url { get; set; }
    public string? oldUrl { get; set; }
}

public class ParkUrls
{
    public ParkUrls()
    {
        Items = new List<ParkUrl>();
    }

    [JsonProperty("parkUrls")]
    public List<ParkUrl> Items { get; set; }
}
