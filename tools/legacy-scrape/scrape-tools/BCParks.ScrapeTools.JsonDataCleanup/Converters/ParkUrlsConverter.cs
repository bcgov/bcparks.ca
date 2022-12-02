using AutoMapper;

namespace ProcessSeedData.Converters
{
    public class ParkUrlsConverter : ConverterBase
    {
        public ParkUrlsConverter(string sourceFile, string destinationFile) : base(sourceFile, destinationFile)
        {

        }

        public void Process()
        {
            var rawObj = ReadRawFile<Deserialization.ParkUrls>();

            var Mapper = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Deserialization.ParkUrl, Serialization.ParkUrl>();
            }).CreateMapper();

            Serialization.ParkUrls newObj = new Serialization.ParkUrls();

            foreach (Deserialization.ParkUrl item in rawObj.Items)
            {
                var newItem = Mapper.Map<Serialization.ParkUrl>(item);
                newObj.Items.Add(newItem);
            }

            WriteProcessedFile<Serialization.ParkUrls>(newObj);
        }
    }
}
