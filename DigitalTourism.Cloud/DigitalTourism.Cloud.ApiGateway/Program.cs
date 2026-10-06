using DigitalTourism.Cloud.ApiGateway.Transforms;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add service defaults (OpenTelemetry, health checks, service discovery)
builder.AddServiceDefaults();

// Configure dual Keycloak JWT authentication (frontoffice + backoffice realms)
var frontofficeAuthority = builder.Configuration["Authentication:Keycloak:FrontofficeAuthority"]
    ?? "http://localhost:8080/realms/frontoffice";

builder.Services.AddAuthentication()
    .AddJwtBearer("Frontoffice", options =>
    {
        options.Authority = frontofficeAuthority;
        options.RequireHttpsMetadata = false; // Allow HTTP in development

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = frontofficeAuthority,
            ValidateAudience = true,
            ValidAudiences = new[] { "digitaltourism-mobile", "digitaltourism-web", "digitaltourism-api" },
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            RoleClaimType = "realm_access.roles",
            NameClaimType = "preferred_username"
        };

        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<Program>>();
                logger.LogWarning("Frontoffice authentication failed: {Error}", context.Exception.Message);
                return Task.CompletedTask;
            }
        };
    })
    ;

// Configure authorization policies with route-based realm selection
builder.Services.AddAuthorization(options =>
{
    // PublicApiAuthenticated policy: Requires authentication via Frontoffice realm (public users)
    // Used for routes: /api/v1/lists/*, /api/v1/attractions/*, etc.
    options.AddPolicy("PublicApiAuthenticated", policy =>
        policy.AddAuthenticationSchemes("Frontoffice")
              .RequireAuthenticatedUser());

});

// Add YARP reverse proxy with service discovery and user context transforms
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"))
    .AddServiceDiscoveryDestinationResolver()
    .AddTransforms<UserContextTransformProvider>();

var app = builder.Build();
// Map default endpoints (health checks)
app.MapDefaultEndpoints();

// Use authentication and authorization
app.UseAuthentication();
app.UseAuthorization();

// Map YARP reverse proxy
app.MapReverseProxy();

app.Run();
