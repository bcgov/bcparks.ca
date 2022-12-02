using Newtonsoft.Json;

namespace ProcessSeedData.Serialization
{
    /// <summary>
    ///   This is a custom class for writing JSON files in the expected format for the content
    ///   import tool. See the corresponding file with the same name in the Deserialization 
    ///   folder converting JSON files exported from the Visitor Service Database into C# objects. 
    ///   There are slight difference in class definitions to achieve the cleanup required.
    /// </summary>
    public class ParkOperation
    {
        public int? orcs { get; set; }
        public string? orcsSiteNumber { get; set; }
        public string? openDate { get; set; }
        public string? closeDate { get; set; }
        public bool isActive { get; set; }
        public bool hasReservations { get; set; }
        public bool hasFirstComeFirstServed { get; set; }
        public bool hasBackcountryReservations { get; set; }
        public bool hasBackcountryPermits { get; set; }
        public bool hasDayUsePass { get; set; }
        public string? reservationUrl { get; set; }
        public string? backcountryReservationUrl { get; set; }
        public string? backcountryPermitUrl { get; set; }
        public string? dayUsePassUrl { get; set; }
        public bool hasParkGate { get; set; }
        public bool offSeasonUse { get; set; }
        public string? totalCapacity { get; set; }
        public string? frontcountrySites { get; set; }
        public string? reservableSites { get; set; }
        public string? nonReservableSites { get; set; }
        public string? vehicleSites { get; set; }
        public string? vehicleSitesReservable { get; set; }
        public string? doubleSites { get; set; }
        public string? pullThroughSites { get; set; }
        public string? rvSites { get; set; }
        public string? rvSitesReservable { get; set; }
        public string? electrifiedSites { get; set; }
        public string? longStaySites { get; set; }
        public string? walkInSites { get; set; }
        public string? walkInSitesReservable { get; set; }
        public string? groupSites { get; set; }
        public string? groupSitesReservable { get; set; }
        public string? backcountrySites { get; set; }
        public string? wildernessSites { get; set; }
        public string? boatAccessSites { get; set; }
        public string? horseSites { get; set; }
        public string? cabins { get; set; }
        public string? huts { get; set; }
        public string? yurts { get; set; }
        public string? shelters { get; set; }
        public string? boatLaunches { get; set; }
        public string? openNote { get; set; }
        public string? serviceNote { get; set; }
        public string? reservationsNote { get; set; }
        public string? offSeasonNote { get; set; }
        public string? generalNote { get; set; }
        public string? adminNote { get; set; }
    }

    public class ParkOperations
    {
        public ParkOperations()
        {
            Items = new List<ParkOperation>();
        }

        [JsonProperty("parkOperation")]
        public List<ParkOperation> Items { get; set; }
    }
}