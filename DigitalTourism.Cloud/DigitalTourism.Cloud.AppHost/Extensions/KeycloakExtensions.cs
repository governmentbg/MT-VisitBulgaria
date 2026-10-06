namespace DigitalTourism.Cloud.AppHost.Extensions;

/// <summary>
/// Connection parameters for an externally hosted Keycloak instance.
/// </summary>
public record KeycloakResources(
    IResourceBuilder<ParameterResource> AuthUrl,
    IResourceBuilder<ParameterResource> BackofficeClientSecret,
    IResourceBuilder<ParameterResource> FrontofficeClientSecret,
    IResourceBuilder<ParameterResource> ServiceClientSecret,
    IResourceBuilder<ParameterResource> BackofficeServiceClientSecret,
    string FrontofficeRealm,
    string BackofficeRealm);

/// <summary>
/// Extension methods for configuring the external Keycloak connection.
/// </summary>
public static class KeycloakExtensions
{
    /// <summary>
    /// Registers the auth URL and client secret parameters for an external Keycloak instance.
    /// </summary>
    public static KeycloakResources AddKeycloak(this IDistributedApplicationBuilder builder)
    {
        var authUrl = builder.AddParameter("auth-url");

        var backofficeClientSecret = builder.AddParameter("keycloak-backoffice-client-secret", secret: true);
        var webClientSecret = builder.AddParameter("keycloak-frontoffice-client-secret", secret: true);
        var serviceClientSecret = builder.AddParameter("keycloak-service-client-secret", secret: true);
        var backofficeServiceClientSecret = builder.AddParameter("keycloak-backoffice-service-client-secret", secret: true);

        return new KeycloakResources(
            authUrl,
            backofficeClientSecret,
            webClientSecret,
            serviceClientSecret,
            backofficeServiceClientSecret,
            FrontofficeRealm: "frontoffice",
            BackofficeRealm: "backoffice");
    }
}
