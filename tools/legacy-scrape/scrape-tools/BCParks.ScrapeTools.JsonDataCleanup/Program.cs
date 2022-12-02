using BCParks.ScrapeTools.JsonDataCleanup.Converters;

namespace BCParks.ScrapeTools.JsonDataCleanup;

internal class Program
{
    // csharpier-ignore
    private static void Main(string[] args)
    {
        new ParkActivityConverter("park-activity.json", "park-activity.json").Process();
        new ParkActivityXRefConverter("park-activity-xref.json", "park-activity-xref.json").Process();
        new ParkDetailsConverter("protected-lands-details.json", "park-details.json").Process();
        new ParkFacilityConverter("park-facility.json", "park-facility.json").Process();
        new ParkFacilityXRefConverter("park-facility-xref.json", "park-facility-xref.json").Process();
        new ParkFireZoneXRefConverter("park-fire-zone-xref.json", "park-fire-zone-xref.json").Process();
        new ParkNameConverter("ParkNames.json ", "park-name.json").Process();
        new ParkOperationConverter("park-operation.json", "park-operation.json").Process();
        new ParkOperationSubareaDatesConverter("park-operation-subarea-dates.json", "park-operation-sub-area-dates.json").Process();
        new ParkOperationSubareasConverter("park-operation-subareas.json", "park-operation-sub-areas.json").Process();
        new ParkOperationSubareaTypesConverter("park-operation-subarea-types.json", "park-operation-sub-area-types.json").Process();
        new ParkUrlsConverter("park-urls.json", "park-urls.json").Process();
        new ProtectedAreaCoordinatesConverter("ProtectedArea.json", "protected-area-coordinates.json").Process();
        new SiteCoordinatesConverter("Site.json", "site-coordinates.json").Process();
    }
}
