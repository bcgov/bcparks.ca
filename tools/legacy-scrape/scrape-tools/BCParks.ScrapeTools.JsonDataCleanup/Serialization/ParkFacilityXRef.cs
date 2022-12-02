using Newtonsoft.Json;

namespace ProcessSeedData.Serialization
{
    /// <summary>
    ///   This is a custom class for writing JSON files in the expected format for the content
    ///   import tool. See the corresponding file with the same name in the Deserialization 
    ///   folder converting JSON files exported from the Visitor Service Database into C# objects. 
    ///   There are slight difference in class definitions to achieve the cleanup required.
    /// </summary>
    public class ParkFacilityXRef
    {
        public string? facilityNumber { get; set; }
        public string? orcs { get; set; }
        public string? orcsSiteNumber { get; set; }
        public string? description { get; set; }
        public bool isFacilityOpen { get; set; }
        public bool isActive { get; set; }
    }

    public class ParkFacilityXRefs
    {
        public ParkFacilityXRefs()
        {
            Items = new List<ParkFacilityXRef>();
        }

        [JsonProperty("parkFacility")]
        public List<ParkFacilityXRef> Items { get; set; }
    }
}
