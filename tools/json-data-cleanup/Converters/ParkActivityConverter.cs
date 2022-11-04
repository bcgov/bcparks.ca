using AutoMapper;

namespace ProcessSeedData.Converters
{
    public class ParkActivityConverter : ConverterBase
    {
        public ParkActivityConverter(string sourceFile, string destinationFile): base(sourceFile, destinationFile)
        {

        }

        public void Process()
        {
            var rawObj = ReadRawFile<Deserialization.ParkActivities>();

            var Mapper = new MapperConfiguration(cfg => {
                cfg.CreateMap<Deserialization.ParkActivity, Serialization.ParkActivity>();
            }).CreateMapper();

            Serialization.ParkActivities newObj = new Serialization.ParkActivities();

            foreach (Deserialization.ParkActivity item in rawObj.Items)
            {
                var newItem = Mapper.Map<Serialization.ParkActivity>(item);

                // strip info from icon paths
                newItem.icon = (newItem.icon ?? "").Replace("https://bcparks.ca/_shared/images/icons/26x26icons/activity/", "").Replace(".svg", "");
                newItem.iconNA = (newItem.iconNA ?? "").Replace("https://bcparks.ca/_shared/images/icons/26x26icons/activity/", "").Replace(".svg", "");

                newObj.Items.Add(newItem);
            }

            WriteProcessedFile<Serialization.ParkActivities>(newObj);
        }
    }
}
