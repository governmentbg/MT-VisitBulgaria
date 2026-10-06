using Aspire.Hosting;

namespace DigitalTourism.Cloud.AppHost.Extensions;

/// <summary>
/// Result containing both Payload CMS resources and the shared secret
/// used by internal service-to-service calls to Payload's custom
/// `/api/search/*` endpoints. Exposed so other services (e.g. the .NET
/// API Service) can inject the same secret into their HTTP clients.
/// </summary>
public record PayloadCmsResources(
    IResourceBuilder<NodeAppResource> App,
    IResourceBuilder<ContainerResource> Migrator,
    IResourceBuilder<ParameterResource> InternalApiSecret);

/// <summary>
/// Extension methods for adding Payload CMS to the Aspire app.
/// </summary>
public static class PayloadCmsExtensions
{
    /// <summary>
    /// Adds Payload CMS as a Node.js/Next.js application with Keycloak authentication and Typesense search.
    /// </summary>
    public static PayloadCmsResources AddPayloadCms(
        this IDistributedApplicationBuilder builder,
        InfrastructureResources infrastructure,
        KeycloakResources keycloak,
        TypesenseResources typesense)
    {
        // Add Payload CMS database
        var payloadDb = infrastructure.Postgres.AddDatabase("payloadcms");
        var postgresHost = infrastructure.Postgres.Resource.PrimaryEndpoint.Property(EndpointProperty.Host);
        var postgresPort = infrastructure.Postgres.Resource.PrimaryEndpoint.Property(EndpointProperty.Port);
        var postgresUser = infrastructure.Postgres.Resource.UserNameReference;
        var postgresPassword = infrastructure.Postgres.Resource.PasswordParameter;

        // Get Payload secret parameter
        var payloadSecret = builder.AddParameter("payload-secret", secret: true);

        // Shared secret used to authenticate internal service-to-service calls
        // to Payload's custom `/api/search/*` endpoints. Required in every
        // environment (local, CI, staging, prod) — the `assertInternalCaller`
        // helper fails closed if it's unset, so there's no "works locally,
        // breaks in prod" failure mode. Set via user-secrets for local dev
        // (`dotnet user-secrets set Parameters:payload-internal-api-secret …`)
        // and via the deploy secret store for remote environments.
        var payloadInternalApiSecret = builder.AddParameter("payload-internal-api-secret", secret: true);

        // Get Keycloak CMS client secret
        var keycloakBackofficeClientSecret = keycloak.BackofficeClientSecret;
        var keycloakFrontofficeClientSecret = keycloak.FrontofficeClientSecret;

        // Get Keycloak service account client secrets
        var keycloakServiceClientSecret = keycloak.ServiceClientSecret;
        var keycloakBackofficeServiceClientSecret = keycloak.BackofficeServiceClientSecret;
        

        // Get environment-specific URLs from parameters
        var spaUrl = builder.AddParameter("spa-url");

        // Get GA4 configuration parameters
        var ga4MeasurementId = builder.AddParameter("ga4-measurement-id");
        var ga4PropertyId = builder.AddParameter("ga4-property-id");
        var ga4CredentialsJson = builder.AddParameter("ga4-credentials-json", secret: true);

        // Weather API configuration
        var weatherApiKey = builder.AddParameter("weather-api-key", secret: true);

        // Mobile deep-link association files (served at /.well-known/assetlinks.json
        // and /.well-known/apple-app-site-association). Values differ per
        // environment (dev/staging/prod) and are injected by the deploy
        // pipeline. Public identifiers — not secrets.
        var androidPackageName = builder.AddParameter("android-package-name", "");
        var androidSha256Fingerprints = builder.AddParameter("android-sha256-fingerprints", "");
        var iosTeamId = builder.AddParameter("ios-team-id", "");
        var iosBundleId = builder.AddParameter("ios-bundle-id", "");

        // OpenTelemetry endpoint
        var otelEndpoint = infrastructure.OtelEndpoint;

        // Get Typesense endpoint for search
        var typesenseEndpoint = typesense.Container.GetEndpoint("api");

        // Use auth-url parameter for Keycloak OIDC issuer (environment-specific)
        var keycloakIssuerBackoffice = ReferenceExpression.Create($"{keycloak.AuthUrl}/realms/backoffice");
        var keycloakIssuerFrontoffice = ReferenceExpression.Create($"{keycloak.AuthUrl}/realms/frontoffice");


        // Get Redis connection for distributed caching
        var redisEndpoint = infrastructure.Redis.Resource.GetEndpoint("tcp");
        var redisPassword = infrastructure.Redis.Resource.PasswordParameter;

        var payloadCms = builder.AddViteApp("payload-cms", "../DigitalTourism.Cloud.PayloadCMS")
            .WithEndpoint("http", (endpointAnnotation) => { endpointAnnotation.Port = 3000; })
            .WithEnvironment("PAYLOAD_SECRET", payloadSecret)
            .WithEnvironment("PREVIEW_SECRET", payloadSecret)
            .WithEnvironment("DATABASE_URL",
                $"postgresql://{postgresUser}:{postgresPassword}@{postgresHost}:{postgresPort}/payloadcms")
            // Redis distributed cache
            .WithEnvironment("REDIS_URL", $"redis://{redisEndpoint.Property(EndpointProperty.Host)}:{redisEndpoint.Property(EndpointProperty.Port)}")
            .WithEnvironment("REDIS_ACCESS_KEY", redisPassword!)
            // Keycloak OIDC configuration
            .WithEnvironment("KEYCLOAK_BACKOFFICE_ISSUER", keycloakIssuerBackoffice)
            .WithEnvironment("KEYCLOAK_BACKOFFICE_CLIENT_ID", "digitaltourism-cms")
            .WithEnvironment("KEYCLOAK_BACKOFFICE_CLIENT_SECRET", keycloakBackofficeClientSecret.Resource)
            .WithEnvironment("KEYCLOAK_FRONTOFFICE_ISSUER", keycloakIssuerFrontoffice)
            .WithEnvironment("KEYCLOAK_FRONTOFFICE_CLIENT_ID", "digitaltourism-web")
            .WithEnvironment("KEYCLOAK_FRONTOFFICE_CLIENT_SECRET", keycloakFrontofficeClientSecret.Resource)
            // Frontoffice service account for registration/password reset
            .WithEnvironment("KEYCLOAK_SERVICE_CLIENT_ID", "digitaltourism-web-service")
            .WithEnvironment("KEYCLOAK_SERVICE_SECRET", keycloakServiceClientSecret.Resource)
            // Backoffice service account for admin user management
            .WithEnvironment("KEYCLOAK_BACKOFFICE_SERVICE_CLIENT_ID", "digitaltourism-cms-service")
            .WithEnvironment("KEYCLOAK_BACKOFFICE_SERVICE_SECRET", keycloakBackofficeServiceClientSecret.Resource)
            .WithEnvironment("NEXT_PUBLIC_SERVER_URL", spaUrl.Resource)
            .WithEnvironment("KEYCLOAK_CALLBACK_URL", ReferenceExpression.Create($"{spaUrl}/api/users/oauth/keycloak/callback"))
            // Typesense search configuration
            .WithEnvironment("TYPESENSE_HOST", typesenseEndpoint.Property(EndpointProperty.Host))
            .WithEnvironment("TYPESENSE_PORT", typesenseEndpoint.Property(EndpointProperty.Port))
            .WithEnvironment("TYPESENSE_API_KEY", typesense.ApiKey)
            // Google Analytics 4 configuration
            .WithEnvironment("NEXT_PUBLIC_GA4_MEASUREMENT_ID", ga4MeasurementId.Resource)
            .WithEnvironment("GA4_PROPERTY_ID", ga4PropertyId.Resource)
            .WithEnvironment("GA4_CREDENTIALS_JSON", ga4CredentialsJson.Resource)
            // Weather API configuration
            .WithEnvironment("WEATHER_API_KEY", weatherApiKey.Resource)
            // Mobile deep-link association files (.well-known/assetlinks.json + AASA)
            .WithEnvironment("MOBILE_ANDROID_PACKAGE_NAME", androidPackageName.Resource)
            .WithEnvironment("MOBILE_ANDROID_SHA256_FINGERPRINTS", androidSha256Fingerprints.Resource)
            .WithEnvironment("MOBILE_IOS_TEAM_ID", iosTeamId.Resource)
            .WithEnvironment("MOBILE_IOS_BUNDLE_ID", iosBundleId.Resource)
            // Shared secret for internal search endpoints — fail-closed
            .WithEnvironment("PAYLOAD_INTERNAL_API_SECRET", payloadInternalApiSecret)
            // OpenTelemetry configuration
            .WithEnvironment("OTEL_EXPORTER_OTLP_ENDPOINT", otelEndpoint)
            .WithEnvironment("OTEL_SERVICE_NAME", "payload-cms")
            .WithReference(payloadDb)
            .WithReference(infrastructure.Redis)
            .WaitFor(payloadDb)
            .WaitFor(infrastructure.Redis)
            .WaitFor(typesense.Container)
            .PublishAsDockerFile();

        // Add Payload CMS migrator container (uses migrator stage of Dockerfile)
        // Only built during publish, not during local development
        IResourceBuilder<ContainerResource>? payloadCmsMigrator = null;
        if (builder.ExecutionContext.IsPublishMode)
        {
            payloadCmsMigrator = builder.AddDockerfile(
                    name: "payload-cms-migrator",
                    contextPath: "../DigitalTourism.Cloud.PayloadCMS",
                    dockerfilePath: "../DigitalTourism.Cloud.PayloadCMS/Dockerfile.migrator")
                .WithEnvironment("PAYLOAD_SECRET", payloadSecret.Resource)
                .WithEnvironment("DATABASE_URL",
                    $"postgresql://{postgresUser}:{postgresPassword}@{postgresHost}:{postgresPort}/payloadcms")
                .WithEnvironment("TYPESENSE_HOST", typesenseEndpoint.Property(EndpointProperty.Host))
                .WithEnvironment("TYPESENSE_PORT", typesenseEndpoint.Property(EndpointProperty.Port))
                .WithEnvironment("TYPESENSE_API_KEY", typesense.ApiKey)
                .WithReference(payloadDb);
        }

        return new PayloadCmsResources(payloadCms, payloadCmsMigrator!, payloadInternalApiSecret);
    }
}