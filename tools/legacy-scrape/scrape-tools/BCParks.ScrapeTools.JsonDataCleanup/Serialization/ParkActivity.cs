using Newtonsoft.Json;

namespace ProcessSeedData.Serialization
{
    /// <summary>
    ///   This is a custom class for writing JSON files in the expected format for the content
    ///   import tool. See the corresponding file with the same name in the Deserialization 
    ///   folder converting JSON files exported from the Visitor Service Database into C# objects. 
    ///   There are slight difference in class definitions to achieve the cleanup required.
    /// </summary>
    public class ParkActivity
    {
        public string? activityNumber { get; set; }
        public string? activityName { get; set; }
        public string? activityCode { get; set; }
        public string? icon { get; set; }
        public string? iconNA { get; set; }
        public string? rank { get; set; }
        public bool? isActive { get; set; }
    }

    public class ParkActivities
    {
        public ParkActivities()
        {
            Items = new List<ParkActivity>();
        }

        [JsonProperty("park-activity")]
        public List<ParkActivity> Items { get; set; }
    }
}
