namespace DigitalTourism.Cloud.AppHost.Extensions;

public static class ApiServiceExtensions
{
    public static IResourceBuilder<ProjectResource> AddApiService(
        this IDistributedApplicationBuilder builder,
        InfrastructureResources infrastructure,
        IResourceBuilder<NodeAppResource> payloadCms,
        IResourceBuilder<ParameterResource> payloadInternalApiSecret)
    {
        var apiService = builder.AddProject<Projects.DigitalTourism_Cloud_ApiService>("api-service")
            .WithEnvironment("OTEL_EXPORTER_OTLP_ENDPOINT", infrastructure.OtelEndpoint)
            .WithEnvironment("OTEL_SERVICE_NAME", "api-service")
            .WithHttpHealthCheck("/health")
            .WithReference(infrastructure.Redis)
            .WithReference(payloadCms)
            // Shared secret for authenticated calls to Payload's internal
            // endpoints. Must match the value injected into the Payload container.
            .WithEnvironment("PAYLOAD_INTERNAL_API_SECRET", payloadInternalApiSecret)
            .WaitFor(infrastructure.Redis)
            .WaitFor(payloadCms);

        return apiService;
    }
}
