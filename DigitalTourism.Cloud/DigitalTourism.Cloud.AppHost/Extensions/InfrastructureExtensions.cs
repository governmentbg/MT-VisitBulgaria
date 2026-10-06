using Aspire.Hosting.ApplicationModel;

namespace DigitalTourism.Cloud.AppHost.Extensions;

/// <summary>
/// Infrastructure resources (PostgreSQL, Redis)
/// </summary>
public record InfrastructureResources(
    IResourceBuilder<PostgresServerResource> Postgres,
    IResourceBuilder<RedisResource> Redis,
    IResourceBuilder<ParameterResource> PostgresUsername,
    IResourceBuilder<ParameterResource> PostgresPassword,
    IResourceBuilder<ParameterResource> OtelEndpoint
);

/// <summary>
/// Extension methods for adding infrastructure services to the Aspire app.
/// </summary>
public static class InfrastructureExtensions
{
    /// <summary>
    /// Adds all infrastructure services: PostgreSQL and Redis.
    /// </summary>
    public static InfrastructureResources AddInfrastructure(this IDistributedApplicationBuilder builder)
    {
        // Add PostgreSQL username and password parameters
        var postgresUsername = builder.AddParameter("postgres-username");
        var postgresPassword = builder.AddParameter("postgres-password", secret: true);

        // Add PostgreSQL with pgAdmin for database management
        var postgres = builder.AddPostgres("postgres", postgresUsername, postgresPassword)
            .WithHostPort(5432)
            .WithDataVolume()
            .WithPgAdmin(pga => pga.WithLifetime(ContainerLifetime.Persistent).WithHostPort(5050))
            .WithLifetime(ContainerLifetime.Persistent);

        // Add Redis for distributed caching
        var redis = builder.AddRedis("redis")
            .WithDataVolume()
            .WithLifetime(ContainerLifetime.Persistent);

        var otelEndpoint = builder.AddParameter("otel-endpoint");

        return new InfrastructureResources(postgres, redis, postgresUsername, postgresPassword, otelEndpoint);
    }
}
