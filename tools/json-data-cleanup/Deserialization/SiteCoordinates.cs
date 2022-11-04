using Newtonsoft.Json;

namespace ProcessSeedData.Deserialization
{
    /// <summary>
    ///   This is a custom class for converting JSON files exported from the Visitor 
    ///   Service Database into C# objects. See the corresponding file with the same name 
    ///   in the Serialization folder for converting C# objects back into JSON. There 
    ///   are slight difference in class definitions to achieve the cleanup required.
    /// </summary>
    public class SiteCoordinate
    {
        public string? orcs { get; set; }
        public string? orcsSiteNumber { get; set; }
        public string? siteName { get; set; }
        public string? latitude { get; set; }
        public string? longitude { get; set; }
        public string? mapZoom { get; set; }
        public string? url { get; set; }
        public string? note { get; set; }
        public string? status { get; set; }
        public string? establishedDate { get; set; }
        public string? repealedDate { get; set; }
    }

    public class SiteCoordinates
    {
        [JsonProperty("")]
        public List<SiteCoordinate> Items { get; set; }
    }
}
