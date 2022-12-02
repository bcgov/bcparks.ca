using AutoMapper;

namespace ProcessSeedData.Converters
{
    public class ParkOperationSubareasConverter : ConverterBase
    {
        public ParkOperationSubareasConverter(string sourceFile, string destinationFile): base(sourceFile, destinationFile)
        {

        }

        public void Process()
        {
            var rawObj = ReadRawFile<Deserialization.ParkOperationSubareas>();

            var Mapper = new MapperConfiguration(cfg => {
                cfg.CreateMap<Deserialization.ParkOperationSubarea, Serialization.ParkOperationSubarea>()
                .ForMember(d => d.facilityNumber, opt => opt.Ignore());
            }).CreateMapper();

            Serialization.ParkOperationSubareas newObj = new Serialization.ParkOperationSubareas();

            foreach (Deserialization.ParkOperationSubarea item in rawObj.Items)
            {
                var newItem = Mapper.Map<Serialization.ParkOperationSubarea>(item);

                // Copy facilityNumber manually because blanks break Automapper
                // NOTE: The data on github has a mix of numbers and empty strings.
                // This code will result in a mix of number and nulls instead
                if (item.facilityNumber != "")
                {
                    newItem.facilityNumber = int.Parse(item.facilityNumber);
                } 
                else
                {
                    newItem.facilityNumber = null;
                }

                newObj.Items.Add(newItem);
            }

            WriteProcessedFile<Serialization.ParkOperationSubareas>(newObj);
        }
    }
}
