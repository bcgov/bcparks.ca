using Newtonsoft.Json;

namespace BCParks.ScrapeTools.Shared.Serialization;

/// <summary>
///     This is a custom class for writing JSON files in the expected format for the content
///     import tool. See the corresponding file with the same name in the Deserialization
///     folder converting JSON files exported from the Visitor Service Database into C# objects.
///     There are slight difference in class definitions to achieve the cleanup required.
/// </summary>
public class ParkNameItem
{
    public int parkNameId { get; set; }
    public int orcs { get; set; }
    public string? parkName { get; set; }
    public int nameTypeId { get; set; }
    public string? source { get; set; }
    public string? note { get; set; }
}

public class ParkNames
{
    public ParkNames()
    {
        Items = new List<ParkNameItem>();
    }

    [JsonProperty("park-name")]
    public List<ParkNameItem> Items { get; set; }
}
