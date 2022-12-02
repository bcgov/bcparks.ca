using AutoMapper;
using BCParks.ScrapeTools.JsonDataCleanup.Deserialization;

namespace BCParks.ScrapeTools.JsonDataCleanup.Converters;

public class ParkOperationSubareaTypesConverter : ConverterBase
{
    public ParkOperationSubareaTypesConverter(string sourceFile, string destinationFile)
        : base(sourceFile, destinationFile) { }

    public void Process()
    {
        var rawObj = ReadRawFile<ParkOperationSubareaTypes>();

        var Mapper = new MapperConfiguration(cfg =>
        {
            cfg.CreateMap<
                ParkOperationSubareaType,
                Shared.Serialization.ParkOperationSubareaType
            >();
        }).CreateMapper();

        var newObj = new Shared.Serialization.ParkOperationSubareaTypes();

        foreach (var item in rawObj.Items)
        {
            var newItem = Mapper.Map<Shared.Serialization.ParkOperationSubareaType>(item);
            newObj.Items.Add(newItem);
        }

        WriteProcessedFile(newObj);
    }
}
