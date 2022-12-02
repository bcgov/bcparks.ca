using AutoMapper;

namespace ProcessSeedData.Converters
{
    public class ParkFacilityXRefConverter : ConverterBase
    {
        public ParkFacilityXRefConverter(string sourceFile, string destinationFile) : base(sourceFile, destinationFile)
        {

        }

        public void Process()
        {
            var rawObj = ReadRawFile<Deserialization.ParkFacilityXRefs>();

            var Mapper = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Deserialization.ParkFacilityXRef, Serialization.ParkFacilityXRef>();
            }).CreateMapper();

            Serialization.ParkFacilityXRefs newObj = new Serialization.ParkFacilityXRefs();

            foreach (Deserialization.ParkFacilityXRef item in rawObj.Items)
            {
                var newItem = Mapper.Map<Serialization.ParkFacilityXRef>(item);

                // manual steps go here
                newItem.description = ProcessHtml(item.description);

                newObj.Items.Add(newItem);
            }

            WriteProcessedFile<Serialization.ParkFacilityXRefs>(newObj);
        }
    }
}
