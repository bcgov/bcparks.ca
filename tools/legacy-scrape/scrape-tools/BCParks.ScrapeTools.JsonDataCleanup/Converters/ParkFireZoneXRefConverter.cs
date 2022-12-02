using AutoMapper;

namespace ProcessSeedData.Converters
{
    public class ParkFireZoneXRefConverter : ConverterBase
    {
        public ParkFireZoneXRefConverter(string sourceFile, string destinationFile) : base(sourceFile, destinationFile)
        {

        }

        public void Process()
        {
            var rawObj = ReadRawFile<Deserialization.ParkFireZoneXRefs>();

            var Mapper = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Deserialization.ParkFireZoneXRef, Serialization.ParkFireZoneXRef>();
            }).CreateMapper();

            Serialization.ParkFireZoneXRefs newObj = new Serialization.ParkFireZoneXRefs();

            foreach (Deserialization.ParkFireZoneXRef item in rawObj.Items)
            {
                var newItem = Mapper.Map<Serialization.ParkFireZoneXRef>(item);

                // manual steps go here

                newObj.Items.Add(newItem);
            }

            WriteProcessedFile<Serialization.ParkFireZoneXRefs>(newObj);
        }
    }
}
