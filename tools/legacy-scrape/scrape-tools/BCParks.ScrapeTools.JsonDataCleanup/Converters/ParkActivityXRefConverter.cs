using AutoMapper;
using BCParks.ScrapeTools.JsonDataCleanup.Deserialization;

namespace BCParks.ScrapeTools.JsonDataCleanup.Converters;

public class ParkActivityXRefConverter : ConverterBase
{
    public ParkActivityXRefConverter(string sourceFile, string destinationFile)
        : base(sourceFile, destinationFile)
    {
    }

    public void Process()
    {
        var rawObj = ReadRawFile<ParkActivityXRefs>();
        var parkNames = new ConverterBase("ParkNames.json").ReadRawFile<ParkNames>();

        var Mapper = new MapperConfiguration(cfg =>
        {
            cfg.CreateMap<ParkActivityXRef,
                Shared.Serialization.ParkActivityXRef>();
        }).CreateMapper();

        var newObj = new Shared.Serialization.ParkActivityXRefs();

        foreach (var item in rawObj.Items)
        {
            var newItem = Mapper.Map<Shared.Serialization.ParkActivityXRef>(item);

            // manual steps go here
            newItem.description = ProcessHtml(item.description);

            if (newItem.activityNumber == "9") // cycling
            {
                if (!newItem.description.Contains("<"))
                {
                    newItem.description = "<p>" + newItem.description + "</p>";
                }

                var parkName =
                    parkNames.Items
                        .FirstOrDefault(p =>
                            p.ORCS == newItem.orcs && p.NameTypeID == "2")
                        ?.ParkName ?? "the park";

                if (
                    rawObj.Items.Any(
                        item =>
                            item.orcsSiteNumber == newItem.orcsSiteNumber
                            && item.activityNumber == "22" // e-biking
                    )
                )
                {
                    newItem.description +=
                        "\n<p>\n  Please note that bicycles with electric assist motors (e-bikes) are permitted on signed or designated trails within "
                        + parkName.Trim()
                        + ", provided they meet the definitions and criteria for e-bike use as outlined in the <a href=\"/plan-your-trip/things-to-do/cycling\">BC Parks cycling guidelines</a>.\n</p>";
                }
                else
                {
                    newItem.description +=
                        "\n<p>\n  Please note that bicycles with electric assist motors (e-bikes) are not allowed on the trails within  "
                        + parkName.Trim()
                        + ". E-bikes are restricted to park roads and areas where motorized use is permitted as outlined in the <a href=\"/plan-your-trip/things-to-do/cycling\">BC Parks cycling guidelines</a>. The only exception to this policy will be for authorized and identified trail maintenance bikes conducting work on behalf of BC Parks.\n</p>";
                }
            }

            newObj.Items.Add(newItem);
        }

        WriteProcessedFile(newObj);
    }
}
