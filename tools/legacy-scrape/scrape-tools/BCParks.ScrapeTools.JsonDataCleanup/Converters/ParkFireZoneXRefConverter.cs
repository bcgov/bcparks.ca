using AutoMapper;
using BCParks.ScrapeTools.JsonDataCleanup.Deserialization;

namespace BCParks.ScrapeTools.JsonDataCleanup.Converters;

public class ParkFireZoneXRefConverter : ConverterBase
{
    public ParkFireZoneXRefConverter(string sourceFile, string destinationFile)
        : base(sourceFile, destinationFile) { }

    public void Process()
    {
        var rawObj = ReadRawFile<ParkFireZoneXRefs>();

        var Mapper = new MapperConfiguration(cfg =>
        {
            cfg.CreateMap<ParkFireZoneXRef, Shared.Serialization.ParkFireZoneXRef>();
        }).CreateMapper();

        var newObj = new Shared.Serialization.ParkFireZoneXRefs();

        foreach (var item in rawObj.Items)
        {
            var newItem = Mapper.Map<Shared.Serialization.ParkFireZoneXRef>(item);

            // manual steps go here

            newObj.Items.Add(newItem);
        }

        WriteProcessedFile(newObj);
    }
}
