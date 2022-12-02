using Newtonsoft.Json;

namespace BCParks.ScrapeTools.JsonDataCleanup.Deserialization;

/// <summary>
///     This is a custom class for converting JSON files exported from the Visitor
///     Service Database into C# objects. See the corresponding file with the same name
///     in the Serialization folder for converting C# objects back into JSON. There
///     are slight difference in class definitions to achieve the cleanup required.
/// </summary>
public class ParkNameItem
{
    public string? ParkNameID { get; set; }
    public string? ORCS { get; set; }
    public string? ParkName { get; set; }
    public string? NameTypeID { get; set; }
    public string? Source { get; set; }
    public string? Note { get; set; }
}

public class ParkNames
{
    [JsonProperty("")]
    public List<ParkNameItem> Items { get; set; }
}
