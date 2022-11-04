using AutoMapper;

namespace ProcessSeedData.Converters
{
    public class ParkDetailsConverter : ConverterBase
    {
        public ParkDetailsConverter(string sourceFile, string destinationFile): base(sourceFile, destinationFile)
        {

        }

        public void Process()
        {
            var rawObj = ReadRawFile<Deserialization.ParkDetails>();

            var Mapper = new MapperConfiguration(cfg => {
                cfg.CreateMap<Deserialization.ParkDetail, Serialization.ParkDetail>();
            }).CreateMapper();

            Serialization.ParkDetails newObj = new Serialization.ParkDetails();

            foreach (Deserialization.ParkDetail item in rawObj.Items)
            {
                var newItem = Mapper.Map<Serialization.ParkDetail>(item);

                // manual steps go here
               
                newObj.Items.Add(newItem);
            }

            WriteProcessedFile<Serialization.ParkDetails>(newObj);
        }
    }
}
