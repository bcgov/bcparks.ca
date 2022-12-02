using AutoMapper;
using BCParks.ScrapeTools.JsonDataCleanup.Deserialization;

namespace BCParks.ScrapeTools.JsonDataCleanup.Converters;

public class ParkActivityXRefConverter : ConverterBase
{
    public ParkActivityXRefConverter(string sourceFile, string destinationFile)
        : base(sourceFile, destinationFile) { }

    public void Process()
    {
        var rawObj = ReadRawFile<ParkActivityXRefs>();

        var Mapper = new MapperConfiguration(cfg =>
        {
            cfg.CreateMap<ParkActivityXRef, Shared.Serialization.ParkActivityXRef>();
        }).CreateMapper();

        var newObj = new Shared.Serialization.ParkActivityXRefs();

        foreach (var item in rawObj.Items)
        {
            var newItem = Mapper.Map<Shared.Serialization.ParkActivityXRef>(item);

            // manual steps go here
            newItem.description = ProcessHtml(item.description);

            newObj.Items.Add(newItem);
        }

        WriteProcessedFile(newObj);
    }
}
