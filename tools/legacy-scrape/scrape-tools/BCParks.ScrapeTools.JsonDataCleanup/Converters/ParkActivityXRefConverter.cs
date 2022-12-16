using AutoMapper;
using BCParks.ScrapeTools.JsonDataCleanup.Deserialization;
using ParkActivityXRef = BCParks.ScrapeTools.Shared.Serialization.ParkActivityXRef;

namespace BCParks.ScrapeTools.JsonDataCleanup.Converters;

public class ParkActivityXRefConverter : ConverterBase
{
    public ParkActivityXRefConverter(string sourceFile, string destinationFile)
        : base(sourceFile, destinationFile) { }

    private ParkNames parkNames { get; set; }

    public void Process()
    {
        var rawObj = ReadRawFile<ParkActivityXRefs>();

        parkNames = new ConverterBase("ParkNames.json").ReadRawFile<ParkNames>();

        var Mapper = new MapperConfiguration(cfg =>
        {
            cfg.CreateMap<Deserialization.ParkActivityXRef, ParkActivityXRef>();
        }).CreateMapper();

        var newObj = new Shared.Serialization.ParkActivityXRefs();

        foreach (var item in rawObj.Items)
        {
            var newItem = Mapper.Map<ParkActivityXRef>(item);

            // manual steps go here
            newItem.description = ProcessHtml(item.description);

            // append the "No eBiking" content to cycling

            if (newItem.activityNumber == "9") // cycling
            {
                if (!newItem.description.Contains("<"))
                {
                    newItem.description = "<p>" + newItem.description + "</p>";
                }

                if (
                    rawObj.Items.Any(
                        i => i.orcsSiteNumber == newItem.orcsSiteNumber && i.activityNumber == "22" // e-biking
                    )
                )
                {
                    newItem.description +=
                        "\n<p class=\"cycling-ebike-allowed\">\n  For details on e-biking within "
                        + GetParkName(newItem)
                        + ", see the <a href=\"#e-biking\">e-biking</a> section.</p>";
                }
                else
                {
                    newItem.description +=
                        "\n<p class=\"cycling-ebike-banned\">\n  Please note that bicycles with electric assist motors (e-bikes) are not allowed on the trails within  "
                        + GetParkName(newItem)
                        + ". E-bikes are restricted to park roads and areas where motorized use is permitted. The only exception to this policy will be for authorized and identified trail maintenance bikes conducting work on behalf of BC Parks.\n</p>";
                }
            }

            // add the "eBiking is okay" content to e-biking

            if (newItem.activityNumber == "22" && string.IsNullOrWhiteSpace(newItem.description)) // e-biking
            {
                newItem.description =
                    "\n<p>\n  Please note that bicycles with electric assist motors (e-bikes) are permitted on signed or designated trails within "
                    + GetParkName(newItem)
                    + ", provided they meet the definitions and criteria for e-bike use as outlined in the <a href=\"/plan-your-trip/things-to-do/cycling#page-section-248\">BC Parks cycling guidelines</a>.\n</p>";
            }

            newObj.Items.Add(newItem);
        }

        WriteProcessedFile(newObj);
    }

    private string GetParkName(ParkActivityXRef newItem)
    {
        return (
            parkNames.Items
                .FirstOrDefault(p => p.ORCS == newItem.orcs && p.NameTypeID == "2")
                ?.ParkName ?? "the park"
        ).Trim();
    }
}
