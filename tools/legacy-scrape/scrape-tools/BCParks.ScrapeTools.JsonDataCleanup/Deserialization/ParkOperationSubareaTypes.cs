using Newtonsoft.Json;

namespace ProcessSeedData.Deserialization
{
    /// <summary>
    ///   This is a custom class for converting JSON files exported from the Visitor 
    ///   Service Database into C# objects. See the corresponding file with the same name 
    ///   in the Serialization folder for converting C# objects back into JSON. There 
    ///   are slight difference in class definitions to achieve the cleanup required.
    /// </summary>
    public class ParkOperationSubareaType
    {
        public string? subAreaTypeId { get; set; }
        public string? subAreaType { get; set; }
        public string? subAreaTypeCode { get; set; }
        public string? iconUrl { get; set; }
        public string? isActive { get; set; }
    }

    public class ParkOperationSubareaTypes
    {
        [JsonProperty("parkOperationSubAreaTypes")]
        public List<ParkOperationSubareaType> Items { get; set; }
    }
}
