using System.Data;
using BCParks.ScrapeTools.Shared;
using Newtonsoft.Json;

namespace BCParks.ScrapeTools.JsonDataCleanup.Converters;

public class ConverterBase
{
    public ConverterBase(string sourceFile, string destinationFile = "")
    {
        this.sourceFile = sourceFile;
        this.destinationFile = destinationFile;
    }

    public string? sourceFile { get; set; }
    public string? destinationFile { get; set; }

    public T ReadRawFile<T>() where T : new()
    {
        var rawFilePath = $@"Z:\_shared\json\{sourceFile}";
        Console.WriteLine("Reading " + rawFilePath);

        var rawJson = File.ReadAllText(rawFilePath);

        if (string.IsNullOrWhiteSpace(rawJson))
        {
            throw new DataException($"{rawFilePath} contains no data");
        }

        return JsonConvert.DeserializeObject<T>(rawJson) ?? new T();
    }

    public void WriteProcessedFile<T>(T newObj)
    {
        var dataPath = PathUtils.GetDataPath();
        var newFilePath = $@"{dataPath}\{destinationFile}";
        Console.WriteLine($"Writing {newFilePath}");
        JsonUtils.WriteProcessedFile(newObj, newFilePath);
        Console.WriteLine("");
    }

    public string ProcessHtml(string html)
    {
        return HtmlCleanup.Process(html);
    }
}
