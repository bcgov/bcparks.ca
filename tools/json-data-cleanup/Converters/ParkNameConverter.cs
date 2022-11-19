using AutoMapper;
using System.Web;

namespace ProcessSeedData.Converters
{
    public class ParkNameConverter : ConverterBase
    {
        public ParkNameConverter(string sourceFile, string destinationFile): base(sourceFile, destinationFile)
        {

        }

        public void Process()
        {
            var rawObj = ReadRawFile<Deserialization.ParkNames>();

            var Mapper = new MapperConfiguration(cfg => {
                cfg.CreateMap<Deserialization.ParkNameItem, Serialization.ParkNameItem>();
            }).CreateMapper();

            Serialization.ParkNames newObj = new Serialization.ParkNames();

            foreach (Deserialization.ParkNameItem item in rawObj.Items)
            {
                var newItem = Mapper.Map<Serialization.ParkNameItem>(item);

                // fix weird character at "Adams Lake Park — Bush Creek Site"
                newItem.parkName = newItem.parkName.Replace("�", "\u2014");

                // unescape HTML
                if (newItem.nameTypeId != 2)
                {
                    newItem.parkName = HttpUtility.HtmlDecode(newItem.parkName);
                }

                newObj.Items.Add(newItem);
            }

            WriteProcessedFile<Serialization.ParkNames>(newObj);
        }
    }
}
