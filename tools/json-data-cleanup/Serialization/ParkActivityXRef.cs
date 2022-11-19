using Newtonsoft.Json;

namespace ProcessSeedData.Serialization
{
    /// <summary>
    ///   This is a custom class for writing JSON files in the expected format for the content
    ///   import tool. See the corresponding file with the same name in the Deserialization 
    ///   folder converting JSON files exported from the Visitor Service Database into C# objects. 
    ///   There are slight difference in class definitions to achieve the cleanup required.
    /// </summary>
    public class ParkActivityXRef
    {
        public string? activityNumber { get; set; }
        public string? orcs { get; set; }
        public string? orcsSiteNumber { get; set; }
        public string? description { get; set; }
        public bool isActivityOpen { get; set; }
        public bool isActive { get; set; }
    }

    public class ParkActivityXRefs
    {
        public ParkActivityXRefs()
        {
            Items = new List<ParkActivityXRef>();
        }

        [JsonProperty("parkActivity")]
        public List<ParkActivityXRef> Items { get; set; }
    }
}
