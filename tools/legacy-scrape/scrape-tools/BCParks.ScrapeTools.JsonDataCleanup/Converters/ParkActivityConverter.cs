using AutoMapper;
using BCParks.ScrapeTools.JsonDataCleanup.Deserialization;

namespace BCParks.ScrapeTools.JsonDataCleanup.Converters;

public class ParkActivityConverter : ConverterBase
{
    public ParkActivityConverter(string sourceFile, string destinationFile)
        : base(sourceFile, destinationFile) { }

    public void Process()
    {
        var rawObj = ReadRawFile<ParkActivities>();

        var Mapper = new MapperConfiguration(cfg =>
        {
            cfg.CreateMap<ParkActivity, Shared.Serialization.ParkActivity>();
        }).CreateMapper();

        var newObj = new Shared.Serialization.ParkActivities();

        foreach (var item in rawObj.Items)
        {
            var newItem = Mapper.Map<Shared.Serialization.ParkActivity>(item);

            // strip info from icon paths
            newItem.icon = (newItem.icon ?? "")
                .Replace("https://bcparks.ca/_shared/images/icons/26x26icons/activity/", "")
                .Replace(".svg", "");
            newItem.iconNA = (newItem.iconNA ?? "")
                .Replace("https://bcparks.ca/_shared/images/icons/26x26icons/activity/", "")
                .Replace(".svg", "");

            newObj.Items.Add(newItem);
        }

        WriteProcessedFile(newObj);
    }
}
