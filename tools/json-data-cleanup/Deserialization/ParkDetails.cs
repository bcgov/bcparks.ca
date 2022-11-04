using Newtonsoft.Json;

namespace ProcessSeedData.Deserialization
{
    /// <summary>
    ///   This is a custom class for converting JSON files exported from the Visitor 
    ///   Service Database into C# objects. See the corresponding file with the same name 
    ///   in the Serialization folder for converting C# objects back into JSON. There 
    ///   are slight difference in class definitions to achieve the cleanup required.
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
        [JsonProperty("parkDetails")]
        public List<ParkDetail> Items { get; set; }
    }
}
