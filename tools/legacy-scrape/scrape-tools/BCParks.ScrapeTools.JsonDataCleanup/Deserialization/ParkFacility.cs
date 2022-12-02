using Newtonsoft.Json;

namespace ProcessSeedData.Deserialization
{
    /// <summary>
    ///   This is a custom class for converting JSON files exported from the Visitor 
    ///   Service Database into C# objects. See the corresponding file with the same name 
    ///   in the Serialization folder for converting C# objects back into JSON. There 
    ///   are slight difference in class definitions to achieve the cleanup required.
    /// </summary>
    public class ParkFacility
    {
        public string? facilityNumber { get; set; }
        public string? facilityName { get; set; }
        public string? facilityCode { get; set; }
        public string? icon { get; set; }
        public string? iconNA { get; set; }
        public string? rank { get; set; }
        public string? assetType { get; set; }
        public string? note { get; set; }
        public string? isActive { get; set; }
        public string? isCamping { get; set; }
    }

    public class ParkFacilities
    {
        [JsonProperty("")]
        public List<ParkFacility> Items { get; set; }
    }
}
