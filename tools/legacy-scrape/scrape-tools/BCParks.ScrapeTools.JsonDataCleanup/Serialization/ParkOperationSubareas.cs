using Newtonsoft.Json;

namespace ProcessSeedData.Serialization
{
    /// <summary>
    ///   This is a custom class for writing JSON files in the expected format for the content
    ///   import tool. See the corresponding file with the same name in the Deserialization 
    ///   folder converting JSON files exported from the Visitor Service Database into C# objects. 
    ///   There are slight difference in class definitions to achieve the cleanup required.
    /// </summary>
    public class ParkOperationSubarea
    {
        public int parkSubAreaId { get; set; }
        public string? parkSubArea { get; set; }
        public int orcs { get; set; }
        public string? orcsSiteNumber { get; set; }
        public bool isActive { get; set; }
        public bool isOpen { get; set; }
        public int parkSubAreaTypeId { get; set; }
        public int? facilityNumber { get; set; }
        public bool hasReservations { get; set; }
        public bool hasFirstComeFirstServed { get; set; }
        public bool hasBackcountryPermits { get; set; }
        public bool hasBackcountryReservations { get; set; }
        public bool isCleanAirSite { get; set; }
        public int? parkAccessUnitId { get; set; }
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
        public string? reservationNote { get; set; }
        public string? offSeasonNote { get; set; }
        public string? adminNote { get; set; }
    }

    public class ParkOperationSubareas
    {
        public ParkOperationSubareas()
        {
            Items = new List<ParkOperationSubarea>();
        }

        [JsonProperty("parkOperationSubAreas")]
        public List<ParkOperationSubarea> Items { get; set; }
    }
}
