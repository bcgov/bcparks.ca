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
                newItem.description = ProcessHtml(item.description);
                newItem.purpose = ProcessHtml(item.purpose);
                newItem.safetyInfo = ProcessHtml(item.safetyInfo);
                newItem.specialNotes = ProcessHtml(item.specialNotes);
                newItem.parkContact = ProcessHtml(item.parkContact);
                newItem.reservations = ProcessHtml(item.reservations);
                newItem.locationNotes = ProcessHtml(item.locationNotes);
                newItem.maps = ProcessHtml(item.maps);
                newItem.natureAndCulture = ProcessHtml(item.natureAndCulture);
                newItem.managementPlanning = ProcessHtml(item.managementPlanning);
                
                newObj.Items.Add(newItem);
            }

            WriteProcessedFile<Serialization.ParkDetails>(newObj);
        }
    }
}
