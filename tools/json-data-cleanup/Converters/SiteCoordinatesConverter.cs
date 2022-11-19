using AutoMapper;

namespace ProcessSeedData.Converters
{
    public class SiteCoordinatesConverter : ConverterBase
    {
        public SiteCoordinatesConverter(string sourceFile, string destinationFile): base(sourceFile, destinationFile)
        {

        }

        public void Process()
        {
            var rawObj = ReadRawFile<Deserialization.SiteCoordinates>();

            var Mapper = new MapperConfiguration(cfg => {
                cfg.CreateMap<Deserialization.SiteCoordinate, Serialization.SiteCoordinate>();
            }).CreateMapper();

            Serialization.SiteCoordinates newObj = new Serialization.SiteCoordinates();

            foreach (Deserialization.SiteCoordinate item in rawObj.Items)
            {
                var newItem = Mapper.Map<Serialization.SiteCoordinate>(item);
                newObj.Items.Add(newItem);
            }

            WriteProcessedFile<Serialization.SiteCoordinates>(newObj);
        }
    }
}
