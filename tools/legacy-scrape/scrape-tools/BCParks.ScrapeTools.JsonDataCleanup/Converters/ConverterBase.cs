using BCParks.ScrapeTools.Shared;
using Newtonsoft.Json;
using System.Data;

namespace ProcessSeedData.Converters
{
    public abstract class ConverterBase
    {
        public string? SourceFile { get; set; }
        public string? DestinationFile { get; set; }

        public ConverterBase(string sourceFile, string destinationFile)
        {
            this.SourceFile = sourceFile;
            this.DestinationFile = destinationFile;
        }

        public string GetDataPath()
        {
            var folder = AppContext.BaseDirectory;
            var path = new DirectoryInfo(folder);

            while (path.Parent != null && !path.FullName.ToLower().EndsWith(@"\tools"))
            {
                path = new DirectoryInfo(path.Parent.FullName);
            }

            return path.FullName.Replace(@"\tools", @"\src\cms\data");
        }

        public T ReadRawFile<T>() where T: new()
        {
            var rawFilePath = $@"Z:\_shared\json\{SourceFile}";
            Console.WriteLine("Reading " + rawFilePath);

            string rawJson = File.ReadAllText(rawFilePath);

            if (string.IsNullOrWhiteSpace(rawJson))
            {
                throw new DataException($"{rawFilePath} contains no data");
            }

            return JsonConvert.DeserializeObject<T>(rawJson) ?? new T { };
        }

        public void WriteProcessedFile<T>(T newObj)
        {
            string dataPath = GetDataPath();

            string newJson = JsonConvert.SerializeObject(newObj, Formatting.Indented, new JsonSerializerSettings
            {
                StringEscapeHandling = StringEscapeHandling.Default
            });

            var newFilePath = $@"{dataPath}\{DestinationFile}";

            Console.WriteLine($"Writing {newFilePath}");
            Console.WriteLine($"");

            File.WriteAllText(newFilePath, newJson);
        }

        public string ProcessHtml(string html)
        {
            return HtmlCleanup.Process(html);
        }
    }
}
