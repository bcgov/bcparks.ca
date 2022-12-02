using Newtonsoft.Json;

namespace ProcessSeedData.Serialization
{
    /// <summary>
    ///   This is a custom class for writing JSON files in the expected format for the content
    ///   import tool. See the corresponding file with the same name in the Deserialization 
    ///   folder converting JSON files exported from the Visitor Service Database into C# objects. 
    ///   There are slight difference in class definitions to achieve the cleanup required.
    /// </summary>
    public class ParkOperationSubareaDate
    {
        public int parkSubAreaId { get; set; }
        public bool isActive { get; set; }
        public int operatingYear { get; set; }
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
        public ParkOperationSubareaDates()
        {
            Items = new List<ParkOperationSubareaDate>();
        }

        [JsonProperty("parkOperationSubAreaDates")]
        public List<ParkOperationSubareaDate> Items { get; set; }
    }
}
