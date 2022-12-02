using AutoMapper;

namespace ProcessSeedData.Converters
{
    public class ProtectedAreaCoordinatesConverter : ConverterBase
    {
        public ProtectedAreaCoordinatesConverter(string sourceFile, string destinationFile) : base(sourceFile, destinationFile)
        {

        }

        public void Process()
        {
            var rawObj = ReadRawFile<Deserialization.ProtectedAreaCoordinates>();

            var Mapper = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Deserialization.ProtectedAreaCoordinate, Serialization.ProtectedAreaCoordinate>();
            }).CreateMapper();

            Serialization.ProtectedAreaCoordinates newObj = new Serialization.ProtectedAreaCoordinates();

            foreach (Deserialization.ProtectedAreaCoordinate item in rawObj.Items)
            {
                var newItem = Mapper.Map<Serialization.ProtectedAreaCoordinate>(item);
                newObj.Items.Add(newItem);
            }

            WriteProcessedFile<Serialization.ProtectedAreaCoordinates>(newObj);
        }
    }
}
