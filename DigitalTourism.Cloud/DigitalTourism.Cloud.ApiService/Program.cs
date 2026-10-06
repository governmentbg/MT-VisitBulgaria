using DigitalTourism.Cloud.ApiService.Services;
using Microsoft.Extensions.Http.Resilience;
using Refit;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

// Add Redis distributed caching (configured via Aspire)
builder.AddRedisDistributedCache("redis");

// Add health checks for dependencies
builder.Services.AddHealthChecks()
    .AddRedis(
        builder.Configuration.GetConnectionString("redis") ?? "localhost",
        name: "redis",
        tags: ["ready"]);

// Shared secret used to authenticate internal calls from the API Service
// to Payload custom endpoints (e.g. /api/search/*). Required in every
// environment — local, CI, staging and prod all share the same code
// path so misconfiguration surfaces immediately instead of only in prod.
var payloadInternalSecret =
    builder.Configuration["PAYLOAD_INTERNAL_API_SECRET"]
    ?? throw new InvalidOperationException(
        "PAYLOAD_INTERNAL_API_SECRET is not configured. Set it via " +
        "`dotnet user-secrets set PAYLOAD_INTERNAL_API_SECRET <value>` " +
        "for local dev, or inject it from your deploy secret store.");

static void ConfigurePayloadHttpClient(HttpClient client, string internalSecret)
{
    // The base address will be resolved via Aspire service discovery
    // Service name matches AddNpmApp("payload-cms", ...) in AppHost
    client.BaseAddress = new Uri("http://payload-cms");
    client.DefaultRequestHeaders.Add("Accept", "application/json");
    client.DefaultRequestHeaders.Add("X-Internal-Api-Secret", internalSecret);
}

// Register Refit client for Payload CMS API
// Service name "payload-cms" matches the AppHost registration
builder.Services
    .AddRefitClient<IPayloadCmsApi>()
    .ConfigureHttpClient(client => ConfigurePayloadHttpClient(client, payloadInternalSecret))
    .AddStandardResilienceHandler(options =>
    {
        options.Retry.MaxRetryAttempts = 2;
        options.Retry.Delay = TimeSpan.FromMilliseconds(500);
        options.AttemptTimeout.Timeout = TimeSpan.FromSeconds(10);
        options.TotalRequestTimeout.Timeout = TimeSpan.FromSeconds(30);
    });

// Register named HttpClient for direct Payload CMS requests (media proxy, favorites, trips)
builder.Services.AddHttpClient("PayloadCms", client =>
    ConfigurePayloadHttpClient(client, payloadInternalSecret));

// Register PayloadCmsService (uses IPayloadCmsApi + caching)
builder.Services.AddScoped<PayloadCmsService>();

builder.Services.AddControllers();

// Add Swagger for API documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new()
    {
        Title = "DigitalTourism API",
        Version = "v1",
        Description = "API for the DigitalTourism mobile application"
    });
});

var app = builder.Build();

app.MapDefaultEndpoints();

// Enable Swagger in development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "DigitalTourism API v1");
    });
}

app.MapControllers();

app.Run();
