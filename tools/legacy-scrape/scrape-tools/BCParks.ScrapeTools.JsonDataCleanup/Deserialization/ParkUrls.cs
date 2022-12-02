using Newtonsoft.Json;

namespace ProcessSeedData.Deserialization
{
    /// <summary>
    ///   This is a custom class for converting JSON files exported from the Visitor 
    ///   Service Database into C# objects. See the corresponding file with the same name 
    ///   in the Serialization folder for converting C# objects back into JSON. There 
    ///   are slight difference in class definitions to achieve the cleanup required.
    /// </summary>
    public class ParkUrl
    {
        public string? orcs { get; set; }
        public string? url { get; set; }
        public string? oldUrl { get; set; }
    }

    public class ParkUrls
    {
        [JsonProperty("parkUrls")]
        public List<ParkUrl> Items { get; set; }
    }
}
