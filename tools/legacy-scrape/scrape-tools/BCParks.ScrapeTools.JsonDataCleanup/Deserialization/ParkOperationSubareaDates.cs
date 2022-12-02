using Newtonsoft.Json;

namespace ProcessSeedData.Deserialization
{
    /// <summary>
    ///   This is a custom class for converting JSON files exported from the Visitor 
    ///   Service Database into C# objects. See the corresponding file with the same name 
    ///   in the Serialization folder for converting C# objects back into JSON. There 
    ///   are slight difference in class definitions to achieve the cleanup required.
    /// </summary>
    public class ParkOperationSubareaDate
    {
        public string? parkSubAreaId { get; set; }
        public string? isActive { get; set; }
        public string? operatingYear { get; set; }
        public string? openDate { get; set; }
        public string? closeDate { get; set; }
        public string? serviceStartDate { get; set; }
        public string? serviceEndDate { get; set; }
        public string? reservationStartDate { get; set; }
        public string? reservationEndDate { get; set; }
        public string? offSeasonStartDate { get; set; }
        public string? offSeasonEndDate { get; set; }
        public string? adminNote { get; set; }
    }

    public class ParkOperationSubareaDates
    {
        [JsonProperty("parkOperationSubAreaDates")]
        public List<ParkOperationSubareaDate> Items { get; set; }
    }
}
