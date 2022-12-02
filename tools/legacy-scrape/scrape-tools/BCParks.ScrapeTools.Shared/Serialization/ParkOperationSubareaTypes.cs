using Newtonsoft.Json;

namespace BCParks.ScrapeTools.Shared.Serialization;

/// <summary>
///     This is a custom class for writing JSON files in the expected format for the content
///     import tool. See the corresponding file with the same name in the Deserialization
///     folder converting JSON files exported from the Visitor Service Database into C# objects.
///     There are slight difference in class definitions to achieve the cleanup required.
/// </summary>
public class ParkOperationSubareaType
{
    public int subAreaTypeId { get; set; }
    public string? subAreaType { get; set; }
    public string? subAreaTypeCode { get; set; }
    public string? iconUrl { get; set; }
    public bool isActive { get; set; }
}

public class ParkOperationSubareaTypes
{
    public ParkOperationSubareaTypes()
    {
        Items = new List<ParkOperationSubareaType>();
    }

    [JsonProperty("parkOperationSubAreaTypes")]
    public List<ParkOperationSubareaType> Items { get; set; }
}
