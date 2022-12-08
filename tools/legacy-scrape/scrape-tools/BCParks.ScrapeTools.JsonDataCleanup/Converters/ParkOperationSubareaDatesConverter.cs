using AutoMapper;
using BCParks.ScrapeTools.JsonDataCleanup.Deserialization;

namespace BCParks.ScrapeTools.JsonDataCleanup.Converters;

public class ParkOperationSubareaDatesConverter : ConverterBase
{
    public ParkOperationSubareaDatesConverter(string sourceFile, string destinationFile)
        : base(sourceFile, destinationFile) { }

    public void Process()
    {
        var rawObj = ReadRawFile<ParkOperationSubareaDates>();

        var Mapper = new MapperConfiguration(cfg =>
        {
            cfg.CreateMap<
                ParkOperationSubareaDate,
                Shared.Serialization.ParkOperationSubareaDate
            >();
        }).CreateMapper();

        var newObj = new Shared.Serialization.ParkOperationSubareaDates();

        foreach (var item in rawObj.Items)
        {
            var newItem = Mapper.Map<Shared.Serialization.ParkOperationSubareaDate>(item);
            newObj.Items.Add(newItem);
        }

        WriteProcessedFile(newObj);
    }
}
