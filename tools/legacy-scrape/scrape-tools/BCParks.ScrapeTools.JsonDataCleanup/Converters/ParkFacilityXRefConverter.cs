using AutoMapper;
using BCParks.ScrapeTools.JsonDataCleanup.Deserialization;

namespace BCParks.ScrapeTools.JsonDataCleanup.Converters;

public class ParkFacilityXRefConverter : ConverterBase
{
    public ParkFacilityXRefConverter(string sourceFile, string destinationFile)
        : base(sourceFile, destinationFile) { }

    public void Process()
    {
        var rawObj = ReadRawFile<ParkFacilityXRefs>();

        var Mapper = new MapperConfiguration(cfg =>
        {
            cfg.CreateMap<ParkFacilityXRef, Shared.Serialization.ParkFacilityXRef>();
        }).CreateMapper();

        var newObj = new Shared.Serialization.ParkFacilityXRefs();

        foreach (var item in rawObj.Items)
        {
            var newItem = Mapper.Map<Shared.Serialization.ParkFacilityXRef>(item);

            // manual steps go here
            newItem.description = ProcessHtml(item.description);

            newObj.Items.Add(newItem);
        }

        WriteProcessedFile(newObj);
    }
}
