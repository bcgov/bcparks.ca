using System.Net.Http;

namespace BCParksApi.Utils
{
    public class ApiHelper
    {
        public static HttpClient httpClient;

        static ApiHelper()
        {
            httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Accept.Clear();
            httpClient.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
        }
    }
}
