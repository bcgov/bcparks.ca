using AutoMapper;

namespace ProcessSeedData.Converters
{
    public class ParkActivityXRefConverter : ConverterBase
    {
        public ParkActivityXRefConverter(string sourceFile, string destinationFile): base(sourceFile, destinationFile)
        {

        }

        public void Process()
        {
            var rawObj = ReadRawFile<Deserialization.ParkActivityXRefs>();

            var Mapper = new MapperConfiguration(cfg => {
                cfg.CreateMap<Deserialization.ParkActivityXRef, Serialization.ParkActivityXRef>();
            }).CreateMapper();

            Serialization.ParkActivityXRefs newObj = new Serialization.ParkActivityXRefs();

            foreach (Deserialization.ParkActivityXRef item in rawObj.Items)
            {
                var newItem = Mapper.Map<Serialization.ParkActivityXRef>(item);

                // manual steps go here
                newItem.description = ProcessHtml(item.description);

                newObj.Items.Add(newItem);
            }

            WriteProcessedFile<Serialization.ParkActivityXRefs>(newObj);
        }
    }
}
