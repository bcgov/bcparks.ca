using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Logging;

namespace BCParksApi.Health
{
    public class BCParksApiHealthCheck : IHealthCheck
    {

        private readonly ILogger<BCParksApiHealthCheck> _logger;

        public BCParksApiHealthCheck(ILogger<BCParksApiHealthCheck> logger)
        {
            _logger = logger;
        }

        public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = new CancellationToken())
        {
            return await Task.FromResult(HealthCheckResult.Healthy("service is healthy"));
        }
    }
}
