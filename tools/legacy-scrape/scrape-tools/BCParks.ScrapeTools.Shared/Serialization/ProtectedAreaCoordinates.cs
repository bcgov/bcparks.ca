using Newtonsoft.Json;

namespace BCParks.ScrapeTools.Shared.Serialization;

/// <summary>
///     This is a custom class for writing JSON files in the expected format for the content
///     import tool. See the corresponding file with the same name in the Deserialization
///     folder converting JSON files exported from the Visitor Service Database into C# objects.
///     There are slight difference in class definitions to achieve the cleanup required.
/// </summary>
public class ProtectedAreaCoordinate
{
    public string? orcs { get; set; }
    public string? protectedAreaName { get; set; }
    public string? url { get; set; }
    public string? latitude { get; set; }
    public string? longitude { get; set; }
    public string? mapZoom { get; set; }
    public bool fogZone { get; set; }
    public bool dayUsePass { get; set; }
    public string? status { get; set; }
}

public class ProtectedAreaCoordinates
{
    public ProtectedAreaCoordinates()
    {
        Items = new List<ProtectedAreaCoordinate>();
    }

    [JsonProperty("protectedArea")]
    public List<ProtectedAreaCoordinate> Items { get; set; }
}
