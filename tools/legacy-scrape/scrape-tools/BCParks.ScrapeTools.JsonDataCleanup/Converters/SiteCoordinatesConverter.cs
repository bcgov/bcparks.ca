using AutoMapper;
using BCParks.ScrapeTools.JsonDataCleanup.Deserialization;

namespace BCParks.ScrapeTools.JsonDataCleanup.Converters;

public class SiteCoordinatesConverter : ConverterBase
{
    public SiteCoordinatesConverter(string sourceFile, string destinationFile)
        : base(sourceFile, destinationFile) { }

    public void Process()
    {
        var rawObj = ReadRawFile<SiteCoordinates>();

        var Mapper = new MapperConfiguration(cfg =>
        {
            cfg.CreateMap<SiteCoordinate, Shared.Serialization.SiteCoordinate>();
        }).CreateMapper();

        var newObj = new Shared.Serialization.SiteCoordinates();

        foreach (var item in rawObj.Items)
        {
            var newItem = Mapper.Map<Shared.Serialization.SiteCoordinate>(item);
            newObj.Items.Add(newItem);
        }

        WriteProcessedFile(newObj);
    }
}
