using Newtonsoft.Json;

namespace ProcessSeedData.Deserialization
{
    /// <summary>
    ///   This is a custom class for converting JSON files exported from the Visitor 
    ///   Service Database into C# objects. See the corresponding file with the same name 
    ///   in the Serialization folder for converting C# objects back into JSON. There 
    ///   are slight difference in class definitions to achieve the cleanup required.
    /// </summary>
    public class ProtectedAreaCoordinate
    {
        public string? orcs { get; set; }
        public string? protectedAreaName { get; set; }
        public string? url { get; set; }
        public string? latitude { get; set; }
        public string? longitude { get; set; }
        public string? mapZoom { get; set; }
        public string? fogZone { get; set; }
        public string? dayUsePass { get; set; }
        public string? status { get; set; }
    }

    public class ProtectedAreaCoordinates
    {
        [JsonProperty("")]
        public List<ProtectedAreaCoordinate> Items { get; set; }
    }
}
