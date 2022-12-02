using Newtonsoft.Json;

namespace ProcessSeedData.Serialization
{
    /// <summary>
    ///   This is a custom class for writing JSON files in the expected format for the content
    ///   import tool. See the corresponding file with the same name in the Deserialization 
    ///   folder converting JSON files exported from the Visitor Service Database into C# objects. 
    ///   There are slight difference in class definitions to achieve the cleanup required.
    /// </summary>
    public class ParkFireZoneXRef
    {
        public string? orcs { get; set; }
        public string? fireZoneNumber { get; set; }
        public string? fireCentreNumber { get; set; }
    }

    public class ParkFireZoneXRefs
    {
        public ParkFireZoneXRefs()
        {
            Items = new List<ParkFireZoneXRef>();
        }

        [JsonProperty("park-fire-zone-xref")]
        public List<ParkFireZoneXRef> Items { get; set; }
    }
}
