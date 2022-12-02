using AutoMapper;

namespace ProcessSeedData.Converters
{
    public class ParkFacilityConverter : ConverterBase
    {
        public ParkFacilityConverter(string sourceFile, string destinationFile): base(sourceFile, destinationFile)
        {

        }

        public void Process()
        {
            var rawObj = ReadRawFile<Deserialization.ParkFacilities>();

            var Mapper = new MapperConfiguration(cfg => {
                cfg.CreateMap<Deserialization.ParkFacility, Serialization.ParkFacility>();
            }).CreateMapper();

            Serialization.ParkFacilities newObj = new Serialization.ParkFacilities();

            foreach (Deserialization.ParkFacility item in rawObj.Items)
            {
                var newItem = Mapper.Map<Serialization.ParkFacility>(item);

                // manual steps go here

                newObj.Items.Add(newItem);
            }

            WriteProcessedFile<Serialization.ParkFacilities>(newObj);
        }
    }
}
