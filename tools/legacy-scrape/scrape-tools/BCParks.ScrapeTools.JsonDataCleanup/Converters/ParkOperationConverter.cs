using AutoMapper;

namespace ProcessSeedData.Converters
{
    public class ParkOperationConverter : ConverterBase
    {
        public ParkOperationConverter(string sourceFile, string destinationFile) : base(sourceFile, destinationFile)
        {

        }

        public void Process()
        {
            var rawObj = ReadRawFile<Deserialization.ParkOperations>();

            var Mapper = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Deserialization.ParkOperation, Serialization.ParkOperation>();
            }).CreateMapper();

            Serialization.ParkOperations newObj = new Serialization.ParkOperations();

            foreach (Deserialization.ParkOperation item in rawObj.Items)
            {
                var newItem = Mapper.Map<Serialization.ParkOperation>(item);

                // reservationNote was renamed to reservationsNote
                newItem.reservationsNote = item.reservationNote;

                newObj.Items.Add(newItem);
            }

            WriteProcessedFile<Serialization.ParkOperations>(newObj);
        }
    }
}
