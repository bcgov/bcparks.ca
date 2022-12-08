namespace BCParks.ScrapeTools.Shared;

public static class PathUtils
{
    public static string GetDataPath()
    {
        var folder = AppContext.BaseDirectory;
        var path = new DirectoryInfo(folder);

        while (path.Parent != null && !path.FullName.ToLower().EndsWith(@"\tools"))
        {
            path = new DirectoryInfo(path.Parent.FullName);
        }

        return path.FullName.Replace(@"\tools", @"\src\cms\data");
    }
}
