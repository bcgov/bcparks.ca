using Newtonsoft.Json;

namespace BCParks.ScrapeTools.JsonDataCleanup.Deserialization;

/// <summary>
///     This is a custom class for converting JSON files exported from the Visitor
///     Service Database into C# objects. See the corresponding file with the same name
///     in the Serialization folder for converting C# objects back into JSON. There
///     are slight difference in class definitions to achieve the cleanup required.
/// </summary>
public class ParkActivityXRef
{
    public string? activityNumber { get; set; }
    public string? orcs { get; set; }
    public string? orcsSiteNumber { get; set; }
    public string? description { get; set; }
    public string? isActivityOpen { get; set; }
    public string? isActive { get; set; }
}

public class ParkActivityXRefs
{
    [JsonProperty("parkActivity")]
    public List<ParkActivityXRef> Items { get; set; }
}
