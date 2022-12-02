using Newtonsoft.Json;

namespace BCParks.ScrapeTools.Shared.Serialization;

/// <summary>
///     This is a custom class for writing JSON files in the expected format for the content
///     import tool. See the corresponding file with the same name in the Deserialization
///     folder converting JSON files exported from the Visitor Service Database into C# objects.
///     There are slight difference in class definitions to achieve the cleanup required.
/// </summary>
public class ParkDetail
{
    public string? orcs { get; set; }
    public string? orcsSiteNumber { get; set; }
    public string? url { get; set; }
    public string? description { get; set; }
    public string? purpose { get; set; }
    public string? safetyInfo { get; set; }
    public string? specialNotes { get; set; }
    public string? parkContact { get; set; }
    public string? reservations { get; set; }
    public string? locationNotes { get; set; }
    public string? maps { get; set; }
    public string? natureAndCulture { get; set; }
    public string? managementPlanning { get; set; }
}

public class ParkDetails
{
    public ParkDetails()
    {
        Items = new List<ParkDetail>();
    }

    [JsonProperty("parkDetails")]
    public List<ParkDetail> Items { get; set; }
}
