using AutoMapper;
using BCParks.ScrapeTools.JsonDataCleanup.Deserialization;

namespace BCParks.ScrapeTools.JsonDataCleanup.Converters;

public class ParkUrlsConverter : ConverterBase
{
    public ParkUrlsConverter(string sourceFile, string destinationFile)
        : base(sourceFile, destinationFile) { }

    public void Process()
    {
        var rawObj = ReadRawFile<ParkUrls>();

        var Mapper = new MapperConfiguration(cfg =>
        {
            cfg.CreateMap<ParkUrl, Shared.Serialization.ParkUrl>();
        }).CreateMapper();

        var newObj = new Shared.Serialization.ParkUrls();

        foreach (var item in rawObj.Items)
        {
            var newItem = Mapper.Map<Shared.Serialization.ParkUrl>(item);
            newObj.Items.Add(newItem);
        }

        WriteProcessedFile(newObj);
    }
}
