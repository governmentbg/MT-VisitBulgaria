using Aspire.Hosting.ApplicationModel;

namespace DigitalTourism.Cloud.AppHost.Extensions;

/// <summary>
/// Typesense resources (container and API key)
/// </summary>
public record TypesenseResources(
    IResourceBuilder<ContainerResource> Container,
    IResourceBuilder<ParameterResource> ApiKey
);

/// <summary>
/// Extension methods for adding Typesense search engine to the Aspire app.
/// </summary>
public static class TypesenseExtensions
{
    /// <summary>
    /// Adds Typesense as a container resource for full-text search.
    /// </summary>
    public static TypesenseResources AddTypesense(
        this IDistributedApplicationBuilder builder,
        string name = "typesense")
    {
        var apiKey = builder.AddParameter("typesense-api-key",
            new GenerateParameterDefault { MinLength = 32, Special = false }, secret: true);

        var container = builder.AddContainer(name, "typesense/typesense", "27.1")
            .WithHttpEndpoint(port: 8108, targetPort: 8108, name: "api")
            .WithEnvironment("TYPESENSE_API_KEY", apiKey)
            .WithEnvironment("TYPESENSE_DATA_DIR", "/data")
            .WithVolume("typesense-data", "/data")
            .WithLifetime(ContainerLifetime.Persistent);

        return new TypesenseResources(container, apiKey);
    }
}