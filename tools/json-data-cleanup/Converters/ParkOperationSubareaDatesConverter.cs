using AutoMapper;

namespace ProcessSeedData.Converters
{
    public class ParkOperationSubareaDatesConverter : ConverterBase
    {
        public ParkOperationSubareaDatesConverter(string sourceFile, string destinationFile): base(sourceFile, destinationFile)
        {

        }

        public void Process()
        {
            var rawObj = ReadRawFile<Deserialization.ParkOperationSubareaDates>();

            var Mapper = new MapperConfiguration(cfg => {
                cfg.CreateMap<Deserialization.ParkOperationSubareaDate, Serialization.ParkOperationSubareaDate>();
            }).CreateMapper();

            Serialization.ParkOperationSubareaDates newObj = new Serialization.ParkOperationSubareaDates();

            foreach (Deserialization.ParkOperationSubareaDate item in rawObj.Items)
            {
                var newItem = Mapper.Map<Serialization.ParkOperationSubareaDate>(item);
                newObj.Items.Add(newItem);
            }

            WriteProcessedFile<Serialization.ParkOperationSubareaDates>(newObj);
        }
    }
}
