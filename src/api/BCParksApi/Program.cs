using System;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Core;

namespace BCParksApi
{
    public class Program
    {
        public static int Main(string[] args)
        {
            // create default logger to ensure any configuration issues are appropriately logged
            Log.Logger = GetDefaultLogger<Program>();

            try
            {
                Log.Debug("Building web host");
                IHost host = CreateHostBuilder(args).Build();

                Log.Information("Starting web host");
                host.Run();
                return 0;
            }
            catch (Exception exception)
            {
                Log.Fatal(exception, "Web host terminated unexpectedly");
                return 1;
            }
            finally
            {
                Log.CloseAndFlush();
            }
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .UseSerilog()
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });

        private static ILogger GetDefaultLogger<TProgram>() where TProgram : class
        {
            IConfiguration configuration = GetConfiguration<TProgram>();

            // we are creating the default logger for the entry point, write to the console as well
            Logger logger = new LoggerConfiguration()
                .ReadFrom.Configuration(configuration)
                .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj} {Properties:j}{NewLine}{Exception}")
                .CreateLogger();

            return logger;
        }

        /// <summary>
        /// Get the configuration in the same way WebHost.CreateDefaultBuilder builds the configuration.
        /// Configuration is required before the WebHost is built, so we need to duplicate the logic.
        /// </summary>
        private static IConfiguration GetConfiguration<TProgram>() where TProgram : class
        {
            // based on the Serilog EarlyInitializationSample
            // https://github.com/serilog/serilog-aspnetcore/blob/dev/samples/EarlyInitializationSample/Program.cs
            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

            var configurationBuilder = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{environment ?? "Production"}.json", optional: true);

            if (environment == "Development")
            {
                configurationBuilder.AddUserSecrets<TProgram>(optional: true);
            }

            configurationBuilder.AddEnvironmentVariables();


            IConfiguration configuration = configurationBuilder.Build();
            return configuration;
        }
    }
}
