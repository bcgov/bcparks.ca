using System.Web;
using AutoMapper;
using BCParks.ScrapeTools.JsonDataCleanup.Deserialization;
using BCParks.ScrapeTools.Shared;

namespace BCParks.ScrapeTools.JsonDataCleanup.Converters;

public class ParkNameConverter : ConverterBase
{
    public ParkNameConverter(string sourceFile, string destinationFile)
        : base(sourceFile, destinationFile) { }

    public void Process()
    {
        var rawObj = ReadRawFile<ParkNames>();

        var Mapper = new MapperConfiguration(cfg =>
        {
            cfg.CreateMap<ParkNameItem, Shared.Serialization.ParkNameItem>();
        }).CreateMapper();

        var newObj = new Shared.Serialization.ParkNames();

        foreach (var item in rawObj.Items)
        {
            var newItem = Mapper.Map<Shared.Serialization.ParkNameItem>(item);

            // fix weird character at "Adams Lake Park — Bush Creek Site"
            newItem.parkName = newItem.parkName.Replace("�", "\u2014");

            // remove the word Provincial from all park names as ler Lea
            newItem.parkName = newItem.parkName.Replace(" Provincial ", " ");

            // unescape HTML
            if (newItem.nameTypeId != 2)
            {
                newItem.parkName = HttpUtility.HtmlDecode(newItem.parkName);
            }
            else
            {
                newItem.parkName = HtmlCleanup.TagsToEntities(newItem.parkName);
            }

            newObj.Items.Add(newItem);
        }

        WriteProcessedFile(newObj);
    }
}
