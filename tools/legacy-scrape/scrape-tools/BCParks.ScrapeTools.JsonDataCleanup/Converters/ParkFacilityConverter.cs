using AutoMapper;
using BCParks.ScrapeTools.JsonDataCleanup.Deserialization;

namespace BCParks.ScrapeTools.JsonDataCleanup.Converters;

public class ParkFacilityConverter : ConverterBase
{
    public ParkFacilityConverter(string sourceFile, string destinationFile)
        : base(sourceFile, destinationFile) { }

    public void Process()
    {
        var rawObj = ReadRawFile<ParkFacilities>();

        var Mapper = new MapperConfiguration(cfg =>
        {
            cfg.CreateMap<ParkFacility, Shared.Serialization.ParkFacility>();
        }).CreateMapper();

        var newObj = new Shared.Serialization.ParkFacilities();

        foreach (var item in rawObj.Items)
        {
            var newItem = Mapper.Map<Shared.Serialization.ParkFacility>(item);

            // manual steps go here

            newObj.Items.Add(newItem);
        }

        WriteProcessedFile(newObj);
    }
}
