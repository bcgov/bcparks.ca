using AutoMapper;
using BCParks.ScrapeTools.JsonDataCleanup.Deserialization;

namespace BCParks.ScrapeTools.JsonDataCleanup.Converters;

public class ProtectedAreaCoordinatesConverter : ConverterBase
{
    public ProtectedAreaCoordinatesConverter(string sourceFile, string destinationFile)
        : base(sourceFile, destinationFile) { }

    public void Process()
    {
        var rawObj = ReadRawFile<ProtectedAreaCoordinates>();

        var Mapper = new MapperConfiguration(cfg =>
        {
            cfg.CreateMap<ProtectedAreaCoordinate, Shared.Serialization.ProtectedAreaCoordinate>();
        }).CreateMapper();

        var newObj = new Shared.Serialization.ProtectedAreaCoordinates();

        foreach (var item in rawObj.Items)
        {
            var newItem = Mapper.Map<Shared.Serialization.ProtectedAreaCoordinate>(item);
            newObj.Items.Add(newItem);
        }

        WriteProcessedFile(newObj);
    }
}
