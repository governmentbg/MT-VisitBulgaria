
namespace DigitalTourism.Cloud.AppHost.Extensions;

/// <summary>
/// Extension methods for adding the API Gateway to the Aspire app.
/// </summary>
public static class ApiGatewayExtensions
{
    /// <summary>
    /// Adds the API Gateway with YARP reverse proxy.
    /// </summary>
    public static IResourceBuilder<ProjectResource> AddApiGateway(
        this IDistributedApplicationBuilder builder,
        InfrastructureResources infrastructure,
        KeycloakResources keycloak,
        IResourceBuilder<ProjectResource> apiService,
        IResourceBuilder<NodeAppResource>? payloadCms = null)
    {
        // Use auth-url parameter for Keycloak authorities (environment-specific)
        var frontofficeAuthority = ReferenceExpression.Create(
            $"{keycloak.AuthUrl}/realms/frontoffice");
        var backofficeAuthority = ReferenceExpression.Create(
            $"{keycloak.AuthUrl}/realms/backoffice");

        var apiGateway = builder.AddProject<Projects.DigitalTourism_Cloud_ApiGateway>("api-gateway")
            .WithEnvironment("OTEL_EXPORTER_OTLP_ENDPOINT", infrastructure.OtelEndpoint)
            .WithEnvironment("OTEL_SERVICE_NAME", "api-gateway")
            .WithExternalHttpEndpoints()
            .WithHttpHealthCheck("/health")
            .WithReference(infrastructure.Redis)
            .WithReference(apiService)
            .WithEnvironment("Authentication__Keycloak__FrontofficeAuthority", frontofficeAuthority)
            .WithEnvironment("Authentication__Keycloak__BackofficeAuthority", backofficeAuthority)
            .WaitFor(apiService);

        // Wire PayloadCMS for service discovery (catch-all proxy + auth transform)
        if (payloadCms is not null)
        {
            var payloadSecret = builder.CreateResourceBuilder(
                builder.Resources.OfType<ParameterResource>().Single(r => r.Name == "payload-secret"));

            apiGateway
                .WithReference(payloadCms)
                .WaitFor(payloadCms)
                .WithEnvironment("PayloadCms__Secret", payloadSecret);
        }

        return apiGateway;
    }
}
