using BCParks.ScrapeTools.JsonDataCleanup.Converters;

namespace BCParks.ScrapeTools.JsonDataCleanup;

internal class Program
{
    private static void Main(string[] args)
    {
        new ParkOperationConverter("park-operation.json", "park-operation.json").Process();
        new ParkOperationSubareaDatesConverter("park-operation-subarea-dates.json", "park-operation-sub-area-dates.json").Process();
        new ParkOperationSubareasConverter("park-operation-subareas.json", "park-operation-sub-areas.json").Process();
        new ParkOperationSubareaTypesConverter("park-operation-subarea-types.json", "park-operation-sub-area-types.json").Process();
    }
}
