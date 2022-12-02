using Newtonsoft.Json;

namespace BCParks.ScrapeTools.JsonDataCleanup.Deserialization;

/// <summary>
///     This is a custom class for converting JSON files exported from the Visitor
///     Service Database into C# objects. See the corresponding file with the same name
///     in the Serialization folder for converting C# objects back into JSON. There
///     are slight difference in class definitions to achieve the cleanup required.
/// </summary>
public class ParkFireZoneXRef
{
    public string? orcs { get; set; }
    public string? fireZoneNumber { get; set; }
    public string? fireCentreNumber { get; set; }
    public string? fireCentreName { get; set; }
    public string? fireZoneName { get; set; }
    public string? headquartersCityName { get; set; }
}

public class ParkFireZoneXRefs
{
    [JsonProperty("")]
    public List<ParkFireZoneXRef> Items { get; set; }
}
