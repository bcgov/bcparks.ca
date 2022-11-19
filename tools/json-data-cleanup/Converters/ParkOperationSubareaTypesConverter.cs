using AutoMapper;

namespace ProcessSeedData.Converters
{
    public class ParkOperationSubareaTypesConverter : ConverterBase
    {
        public ParkOperationSubareaTypesConverter(string sourceFile, string destinationFile): base(sourceFile, destinationFile)
        {

        }

        public void Process()
        {
            var rawObj = ReadRawFile<Deserialization.ParkOperationSubareaTypes>();

            var Mapper = new MapperConfiguration(cfg => {
                cfg.CreateMap<Deserialization.ParkOperationSubareaType, Serialization.ParkOperationSubareaType>();
            }).CreateMapper();

            Serialization.ParkOperationSubareaTypes newObj = new Serialization.ParkOperationSubareaTypes();

            foreach (Deserialization.ParkOperationSubareaType item in rawObj.Items)
            {
                var newItem = Mapper.Map<Serialization.ParkOperationSubareaType>(item);
                newObj.Items.Add(newItem);
            }

            WriteProcessedFile<Serialization.ParkOperationSubareaTypes>(newObj);
        }
    }
}
