using Newtonsoft.Json;

namespace BCParks.ScrapeTools.Shared.Serialization;

/// <summary>
///     This is a custom class for writing JSON files in the expected format for the content
///     import tool. See the corresponding file with the same name in the Deserialization
///     folder converting JSON files exported from the Visitor Service Database into C# objects.
///     There are slight difference in class definitions to achieve the cleanup required.
/// </summary>
public class ParkFacility
{
    public string? facilityNumber { get; set; }
    public string? facilityName { get; set; }
    public string? facilityCode { get; set; }
    public string? icon { get; set; }
    public string? iconNA { get; set; }
    public string? rank { get; set; }
    public string? assetType { get; set; }
    public string? note { get; set; }
    public bool isActive { get; set; }
    public bool isCamping { get; set; }
}

public class ParkFacilities
{
    public ParkFacilities()
    {
        Items = new List<ParkFacility>();
    }

    [JsonProperty("park-facility")]
    public List<ParkFacility> Items { get; set; }
}
