using DigitalTourism.Cloud.ApiService.Models;
using Refit;

namespace DigitalTourism.Cloud.ApiService.Services;

/// <summary>
/// Refit interface for Payload CMS REST API
/// </summary>
public interface IPayloadCmsApi
{
    #region Attractions

    [Get("/api/attractions")]
    Task<PayloadPaginatedResponse<PayloadAttraction>> GetAttractionsAsync(
        [Query] int page = 1,
        [Query] int limit = 10,
        [Query] int depth = 1,
        [Query] string? locale = null,
        [AliasAs("where[categories][in]")] string? categoryId = null,
        [AliasAs("where[_status][equals]")] string status = "published",
        CancellationToken cancellationToken = default);

    [Get("/api/attractions/{id}")]
    Task<PayloadAttraction> GetAttractionByIdAsync(
        int id,
        [Query] int depth = 2,
        [Query] string? locale = null,
        CancellationToken cancellationToken = default);

    [Get("/api/attractions")]
    Task<PayloadPaginatedResponse<PayloadAttraction>> GetAttractionsBySlugAsync(
        [AliasAs("where[slug][equals]")] string slug,
        [Query] int depth = 2,
        [Query] int limit = 1,
        [Query] string? locale = null,
        CancellationToken cancellationToken = default);

    #endregion

    #region Events

    [Get("/api/events")]
    Task<PayloadPaginatedResponse<PayloadEvent>> GetEventsAsync(
        [Query] int page = 1,
        [Query] int limit = 10,
        [Query] int depth = 1,
        [Query] string? locale = null,
        [AliasAs("where[_status][equals]")] string status = "published",
        CancellationToken cancellationToken = default);

    [Get("/api/events/{id}")]
    Task<PayloadEvent> GetEventByIdAsync(
        int id,
        [Query] int depth = 2,
        [Query] string? locale = null,
        CancellationToken cancellationToken = default);

    [Get("/api/events")]
    Task<PayloadPaginatedResponse<PayloadEvent>> GetEventsBySlugAsync(
        [AliasAs("where[slug][equals]")] string slug,
        [Query] int depth = 2,
        [Query] int limit = 1,
        [Query] string? locale = null,
        CancellationToken cancellationToken = default);

    #endregion

    #region Hotels

    [Get("/api/hotels")]
    Task<PayloadPaginatedResponse<PayloadHotel>> GetHotelsAsync(
        [Query] int page = 1,
        [Query] int limit = 10,
        [Query] int depth = 1,
        [Query] string? locale = null,
        [AliasAs("where[_status][equals]")] string status = "published",
        CancellationToken cancellationToken = default);

    [Get("/api/hotels/{id}")]
    Task<PayloadHotel> GetHotelByIdAsync(
        int id,
        [Query] int depth = 2,
        [Query] string? locale = null,
        CancellationToken cancellationToken = default);

    [Get("/api/hotels")]
    Task<PayloadPaginatedResponse<PayloadHotel>> GetHotelsBySlugAsync(
        [AliasAs("where[slug][equals]")] string slug,
        [Query] int depth = 2,
        [Query] int limit = 1,
        [Query] string? locale = null,
        CancellationToken cancellationToken = default);

    #endregion

    #region Restaurants

    [Get("/api/restaurants")]
    Task<PayloadPaginatedResponse<PayloadRestaurant>> GetRestaurantsAsync(
        [Query] int page = 1,
        [Query] int limit = 10,
        [Query] int depth = 1,
        [Query] string? locale = null,
        [AliasAs("where[_status][equals]")] string status = "published",
        CancellationToken cancellationToken = default);

    [Get("/api/restaurants/{id}")]
    Task<PayloadRestaurant> GetRestaurantByIdAsync(
        int id,
        [Query] int depth = 2,
        [Query] string? locale = null,
        CancellationToken cancellationToken = default);

    [Get("/api/restaurants")]
    Task<PayloadPaginatedResponse<PayloadRestaurant>> GetRestaurantsBySlugAsync(
        [AliasAs("where[slug][equals]")] string slug,
        [Query] int depth = 2,
        [Query] int limit = 1,
        [Query] string? locale = null,
        CancellationToken cancellationToken = default);

    #endregion

    #region Activities

    [Get("/api/activities")]
    Task<PayloadPaginatedResponse<PayloadActivity>> GetActivitiesAsync(
        [Query] int page = 1,
        [Query] int limit = 10,
        [Query] int depth = 1,
        [Query] string? locale = null,
        [AliasAs("where[_status][equals]")] string status = "published",
        CancellationToken cancellationToken = default);

    [Get("/api/activities/{id}")]
    Task<PayloadActivity> GetActivityByIdAsync(
        int id,
        [Query] int depth = 2,
        [Query] string? locale = null,
        CancellationToken cancellationToken = default);

    [Get("/api/activities")]
    Task<PayloadPaginatedResponse<PayloadActivity>> GetActivitiesBySlugAsync(
        [AliasAs("where[slug][equals]")] string slug,
        [Query] int depth = 2,
        [Query] int limit = 1,
        [Query] string? locale = null,
        CancellationToken cancellationToken = default);

    #endregion

    #region Cities

    [Get("/api/cities")]
    Task<PayloadPaginatedResponse<PayloadCityDocument>> GetCitiesAsync(
        [Query] int page = 1,
        [Query] int limit = 500,
        [Query] int depth = 1,
        [Query] string? locale = null,
        CancellationToken cancellationToken = default);

    [Get("/api/cities/{id}")]
    Task<PayloadCityDocument> GetCityByIdAsync(
        int id,
        [Query] int depth = 1,
        [Query] string? locale = null,
        CancellationToken cancellationToken = default);

    #endregion

    #region Categories

    [Get("/api/categories")]
    Task<PayloadPaginatedResponse<PayloadCategory>> GetCategoriesAsync(
        [Query] int limit = 100,
        [Query] string? locale = null,
        CancellationToken cancellationToken = default);

    #endregion

    #region Media

    [Get("/api/media/{id}")]
    Task<PayloadMedia> GetMediaByIdAsync(
        int id,
        CancellationToken cancellationToken = default);

    #endregion

    #region Settings Global

    [Get("/api/globals/settings")]
    Task<PayloadSettings> GetSettingsGlobalAsync(
        [Query] int depth = 1,
        [Query] string? locale = null,
        CancellationToken cancellationToken = default);

    #endregion

    #region Structured Search (custom Payload endpoints)

    [Post("/api/search/experiences")]
    Task<ExperienceSearchResponse> SearchExperiencesAsync(
        [Body] ExperienceSearchRequest request,
        CancellationToken cancellationToken = default);

    [Post("/api/search/map")]
    Task<MapSearchResponse> SearchMapAsync(
        [Body] MapSearchRequest request,
        CancellationToken cancellationToken = default);

    [Get("/api/search/facet-config")]
    Task<List<FacetConfigItem>> GetFacetConfigAsync(
        CancellationToken cancellationToken = default);

    #endregion
}
