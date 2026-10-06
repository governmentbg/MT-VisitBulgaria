using System.Security.Claims;
using Yarp.ReverseProxy.Transforms;
using Yarp.ReverseProxy.Transforms.Builder;

namespace DigitalTourism.Cloud.ApiGateway.Transforms;

public class UserContextTransformProvider : ITransformProvider
{
    public void ValidateRoute(TransformRouteValidationContext context)
    {
    }

    public void ValidateCluster(TransformClusterValidationContext context)
    {
    }

    public void Apply(TransformBuilderContext context)
    {
        context.AddRequestTransform(transformContext =>
        {
            var user = transformContext.HttpContext.User;

            if (user.Identity?.IsAuthenticated == true)
            {
                // Extract user ID from JWT claims (sub claim)
                var userId = user.FindFirstValue(ClaimTypes.NameIdentifier)
                    ?? user.FindFirstValue("sub")
                    ?? string.Empty;

                // Extract preferred username
                var username = user.FindFirstValue("preferred_username")
                    ?? user.FindFirstValue(ClaimTypes.Name)
                    ?? string.Empty;

                // Extract email
                var email = user.FindFirstValue(ClaimTypes.Email)
                    ?? user.FindFirstValue("email")
                    ?? string.Empty;

                // Extract user's preferred locale
                var locale = user.FindFirstValue("locale") ?? "en";

                // Extract roles - try realm_access.roles first (our custom mapper), then realm_access JSON
                var roles = string.Join(",", user.FindAll("realm_access.roles").Select(c => c.Value));
                if (string.IsNullOrEmpty(roles))
                {
                    var realmAccess = user.FindFirstValue("realm_access") ?? string.Empty;
                    roles = ExtractRolesFromRealmAccess(realmAccess);
                }

                // Add headers for downstream services
                transformContext.ProxyRequest.Headers.Remove("X-User-Id");
                transformContext.ProxyRequest.Headers.Remove("X-User-Name");
                transformContext.ProxyRequest.Headers.Remove("X-User-Email");
                transformContext.ProxyRequest.Headers.Remove("X-User-Roles");
                transformContext.ProxyRequest.Headers.Remove("X-User-Language");

                if (!string.IsNullOrEmpty(userId))
                    transformContext.ProxyRequest.Headers.Add("X-User-Id", userId);

                if (!string.IsNullOrEmpty(username))
                    transformContext.ProxyRequest.Headers.Add("X-User-Name", username);

                if (!string.IsNullOrEmpty(email))
                    transformContext.ProxyRequest.Headers.Add("X-User-Email", email);

                if (!string.IsNullOrEmpty(roles))
                    transformContext.ProxyRequest.Headers.Add("X-User-Roles", roles);

                transformContext.ProxyRequest.Headers.Add("X-User-Language", locale);
            }

            // Add correlation ID for distributed tracing
            var correlationId = transformContext.HttpContext.Request.Headers["X-Correlation-Id"].FirstOrDefault()
                ?? Guid.NewGuid().ToString();

            transformContext.ProxyRequest.Headers.Remove("X-Correlation-Id");
            transformContext.ProxyRequest.Headers.Add("X-Correlation-Id", correlationId);

            return ValueTask.CompletedTask;
        });
    }

    private static string ExtractRolesFromRealmAccess(string realmAccess)
    {
        if (string.IsNullOrEmpty(realmAccess))
            return string.Empty;

        try
        {
            // realm_access is a JSON object like {"roles":["user","admin"]}
            var json = System.Text.Json.JsonDocument.Parse(realmAccess);
            if (json.RootElement.TryGetProperty("roles", out var rolesElement))
            {
                var roles = rolesElement.EnumerateArray()
                    .Select(r => r.GetString())
                    .Where(r => !string.IsNullOrEmpty(r));
                return string.Join(",", roles);
            }
        }
        catch
        {
            // If parsing fails, return empty
        }

        return string.Empty;
    }
}
