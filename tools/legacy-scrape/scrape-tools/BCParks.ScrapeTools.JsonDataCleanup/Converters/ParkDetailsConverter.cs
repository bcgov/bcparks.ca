using AutoMapper;
using BCParks.ScrapeTools.JsonDataCleanup.Deserialization;

namespace BCParks.ScrapeTools.JsonDataCleanup.Converters;

public class ParkDetailsConverter : ConverterBase
{
    public ParkDetailsConverter(string sourceFile, string destinationFile)
        : base(sourceFile, destinationFile) { }

    public void Process()
    {
        var rawObj = ReadRawFile<ParkDetails>();

        var Mapper = new MapperConfiguration(cfg =>
        {
            cfg.CreateMap<ParkDetail, Shared.Serialization.ParkDetail>();
        }).CreateMapper();

        var newObj = new Shared.Serialization.ParkDetails();

        foreach (var item in rawObj.Items)
        {
            var newItem = Mapper.Map<Shared.Serialization.ParkDetail>(item);

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

        WriteProcessedFile(newObj);
    }
}
