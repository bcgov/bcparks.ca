using AutoMapper;
using BCParks.ScrapeTools.JsonDataCleanup.Deserialization;

namespace BCParks.ScrapeTools.JsonDataCleanup.Converters;

public class ParkOperationConverter : ConverterBase
{
    public ParkOperationConverter(string sourceFile, string destinationFile)
        : base(sourceFile, destinationFile) { }

    public void Process()
    {
        var rawObj = ReadRawFile<ParkOperations>();

        var Mapper = new MapperConfiguration(cfg =>
        {
            cfg.CreateMap<ParkOperation, Shared.Serialization.ParkOperation>();
        }).CreateMapper();

        var newObj = new Shared.Serialization.ParkOperations();

        foreach (var item in rawObj.Items)
        {
            var newItem = Mapper.Map<Shared.Serialization.ParkOperation>(item);

            // reservationNote was renamed to reservationsNote
            newItem.reservationsNote = item.reservationNote;

            newObj.Items.Add(newItem);
        }

        WriteProcessedFile(newObj);
    }
}
