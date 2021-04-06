using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using NSwag.Annotations;

namespace BCParksApi.Controllers
{
    [OpenApiTag("BC Parks API")]
    [Route("api/[controller]")]
    [Produces("application/json")]
    [ApiController]
    public class ProtectedAreaController : ControllerBase
    {
        private readonly ILogger _logger;
        public ProtectedAreaController(ILogger<ProtectedAreaController> logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        [HttpGet]
        [ProducesResponseType(typeof(IQueryable<>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetProtectedArea()
        {

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync("http://localhost:1337/protectedAreas"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    return Ok(JsonConvert.DeserializeObject<object>(apiResponse));
                }
            }
        }

    }
}
