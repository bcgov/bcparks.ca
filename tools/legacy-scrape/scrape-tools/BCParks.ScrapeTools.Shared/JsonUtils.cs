using Newtonsoft.Json;

namespace BCParks.ScrapeTools.Shared;

public static class JsonUtils
{
    public static void WriteProcessedFile<T>(T newObj, string newFilePath)
    {
        var newJson = JsonConvert.SerializeObject(
            newObj,
            Formatting.Indented,
            new JsonSerializerSettings { StringEscapeHandling = StringEscapeHandling.Default }
        );

        File.WriteAllText(newFilePath, newJson);
    }
}
