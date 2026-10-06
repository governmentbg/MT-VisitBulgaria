using DigitalTourism.Cloud.AppHost.Extensions;

var builder = DistributedApplication.CreateBuilder(args);

// Add infrastructure services (PostgreSQL, Redis)
var infrastructure = builder.AddInfrastructure();

// External Keycloak connection parameters
var keycloakResources = builder.AddKeycloak();

// Add Typesense search engine
var typesense = builder.AddTypesense();

// Add Payload CMS (Next.js based headless CMS) with Keycloak SSO and Typesense search
var payloadCmsResources = builder.AddPayloadCms(infrastructure, keycloakResources, typesense);
var payloadCms = payloadCmsResources.App;
var payloadInternalApiSecret = payloadCmsResources.InternalApiSecret;

// Add API Service (main backend API) with reference to Payload CMS
var apiService = builder.AddApiService(
    infrastructure,
    payloadCms,
    payloadInternalApiSecret);

// Add API Gateway with YARP
var apiGateway = builder.AddApiGateway(infrastructure, keycloakResources, apiService, payloadCms);


await builder.Build().RunAsync();
