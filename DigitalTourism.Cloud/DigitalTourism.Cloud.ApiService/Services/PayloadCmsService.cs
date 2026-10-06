using System.Text.Json;
using DigitalTourism.Cloud.ApiService.Models;
using Microsoft.Extensions.Caching.Distributed;
using Refit;

namespace DigitalTourism.Cloud.ApiService.Services;

/// <summary>
/// Service for interacting with Payload CMS REST API.
/// Uses Refit for strongly-typed HTTP calls with Redis caching.
/// </summary>
public class PayloadCmsService(
    IPayloadCmsApi api,
    IDistributedCache cache,
    ILogger<PayloadCmsService> logger)
{
    private static readonly TimeSpan ListCacheDuration = TimeSpan.FromMinutes(5);
    private static readonly TimeSpan DetailCacheDuration = TimeSpan.FromMinutes(10);

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    #region Attractions

    public async Task<PayloadPaginatedResponse<PayloadAttraction>> GetAttractionsAsync(
        int page = 1, int limit = 10, string? locale = null, string? categoryId = null,
        CancellationToken cancellationToken = default)
    {
        var cacheKey = $"attractions:list:{page}:{limit}:{locale}:{categoryId}";
        var cached = await GetFromCacheAsync<PayloadPaginatedResponse<PayloadAttraction>>(cacheKey, cancellationToken);
        if (cached is not null) { logger.LogDebug("Cache hit for {CacheKey}", cacheKey); return cached; }

        logger.LogInformation("Fetching attractions: page={Page}, limit={Limit}, locale={Locale}", page, limit, locale);
        var response = await api.GetAttractionsAsync(page: page, limit: limit, locale: locale, categoryId: categoryId, cancellationToken: cancellationToken);
        await SetCacheAsync(cacheKey, response, ListCacheDuration, cancellationToken);
        return response;
    }

    public async Task<PayloadAttraction?> GetAttractionByIdAsync(
        int id, string? locale = null, CancellationToken cancellationToken = default)
    {
        var cacheKey = $"attractions:detail:{id}:{locale}";
        var cached = await GetFromCacheAsync<PayloadAttraction>(cacheKey, cancellationToken);
        if (cached is not null) return cached;

        try
        {
            var response = await api.GetAttractionByIdAsync(id, locale: locale, cancellationToken: cancellationToken);
            await SetCacheAsync(cacheKey, response, DetailCacheDuration, cancellationToken);
            return response;
        }
        catch (ApiException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound) { return null; }
    }

    public async Task<PayloadAttraction?> GetAttractionBySlugAsync(
        string slug, string? locale = null, CancellationToken cancellationToken = default)
    {
        var cacheKey = $"attractions:slug:{slug}:{locale}";
        var cached = await GetFromCacheAsync<PayloadAttraction>(cacheKey, cancellationToken);
        if (cached is not null) return cached;

        var response = await api.GetAttractionsBySlugAsync(slug, locale: locale, cancellationToken: cancellationToken);
        var item = response.Docs.FirstOrDefault();
        if (item is not null) await SetCacheAsync(cacheKey, item, DetailCacheDuration, cancellationToken);
        return item;
    }

    #endregion

    #region Events

    public async Task<PayloadPaginatedResponse<PayloadEvent>> GetEventsAsync(
        int page = 1, int limit = 10, string? locale = null,
        CancellationToken cancellationToken = default)
    {
        var cacheKey = $"events:list:{page}:{limit}:{locale}";
        var cached = await GetFromCacheAsync<PayloadPaginatedResponse<PayloadEvent>>(cacheKey, cancellationToken);
        if (cached is not null) { logger.LogDebug("Cache hit for {CacheKey}", cacheKey); return cached; }

        logger.LogInformation("Fetching events: page={Page}, limit={Limit}, locale={Locale}", page, limit, locale);
        var response = await api.GetEventsAsync(page: page, limit: limit, locale: locale, cancellationToken: cancellationToken);
        await SetCacheAsync(cacheKey, response, ListCacheDuration, cancellationToken);
        return response;
    }

    public async Task<PayloadEvent?> GetEventByIdAsync(
        int id, string? locale = null, CancellationToken cancellationToken = default)
    {
        var cacheKey = $"events:detail:{id}:{locale}";
        var cached = await GetFromCacheAsync<PayloadEvent>(cacheKey, cancellationToken);
        if (cached is not null) return cached;

        try
        {
            var response = await api.GetEventByIdAsync(id, locale: locale, cancellationToken: cancellationToken);
            await SetCacheAsync(cacheKey, response, DetailCacheDuration, cancellationToken);
            return response;
        }
        catch (ApiException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound) { return null; }
    }

    public async Task<PayloadEvent?> GetEventBySlugAsync(
        string slug, string? locale = null, CancellationToken cancellationToken = default)
    {
        var cacheKey = $"events:slug:{slug}:{locale}";
        var cached = await GetFromCacheAsync<PayloadEvent>(cacheKey, cancellationToken);
        if (cached is not null) return cached;

        var response = await api.GetEventsBySlugAsync(slug, locale: locale, cancellationToken: cancellationToken);
        var item = response.Docs.FirstOrDefault();
        if (item is not null) await SetCacheAsync(cacheKey, item, DetailCacheDuration, cancellationToken);
        return item;
    }

    #endregion

    #region Hotels

    public async Task<PayloadPaginatedResponse<PayloadHotel>> GetHotelsAsync(
        int page = 1, int limit = 10, string? locale = null,
        CancellationToken cancellationToken = default)
    {
        var cacheKey = $"hotels:list:{page}:{limit}:{locale}";
        var cached = await GetFromCacheAsync<PayloadPaginatedResponse<PayloadHotel>>(cacheKey, cancellationToken);
        if (cached is not null) { logger.LogDebug("Cache hit for {CacheKey}", cacheKey); return cached; }

        logger.LogInformation("Fetching hotels: page={Page}, limit={Limit}, locale={Locale}", page, limit, locale);
        var response = await api.GetHotelsAsync(page: page, limit: limit, locale: locale, cancellationToken: cancellationToken);
        await SetCacheAsync(cacheKey, response, ListCacheDuration, cancellationToken);
        return response;
    }

    public async Task<PayloadHotel?> GetHotelByIdAsync(
        int id, string? locale = null, CancellationToken cancellationToken = default)
    {
        var cacheKey = $"hotels:detail:{id}:{locale}";
        var cached = await GetFromCacheAsync<PayloadHotel>(cacheKey, cancellationToken);
        if (cached is not null) return cached;

        try
        {
            var response = await api.GetHotelByIdAsync(id, locale: locale, cancellationToken: cancellationToken);
            await SetCacheAsync(cacheKey, response, DetailCacheDuration, cancellationToken);
            return response;
        }
        catch (ApiException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound) { return null; }
    }

    public async Task<PayloadHotel?> GetHotelBySlugAsync(
        string slug, string? locale = null, CancellationToken cancellationToken = default)
    {
        var cacheKey = $"hotels:slug:{slug}:{locale}";
        var cached = await GetFromCacheAsync<PayloadHotel>(cacheKey, cancellationToken);
        if (cached is not null) return cached;

        var response = await api.GetHotelsBySlugAsync(slug, locale: locale, cancellationToken: cancellationToken);
        var item = response.Docs.FirstOrDefault();
        if (item is not null) await SetCacheAsync(cacheKey, item, DetailCacheDuration, cancellationToken);
        return item;
    }

    #endregion

    #region Restaurants

    public async Task<PayloadPaginatedResponse<PayloadRestaurant>> GetRestaurantsAsync(
        int page = 1, int limit = 10, string? locale = null,
        CancellationToken cancellationToken = default)
    {
        var cacheKey = $"restaurants:list:{page}:{limit}:{locale}";
        var cached = await GetFromCacheAsync<PayloadPaginatedResponse<PayloadRestaurant>>(cacheKey, cancellationToken);
        if (cached is not null) { logger.LogDebug("Cache hit for {CacheKey}", cacheKey); return cached; }

        logger.LogInformation("Fetching restaurants: page={Page}, limit={Limit}, locale={Locale}", page, limit, locale);
        var response = await api.GetRestaurantsAsync(page: page, limit: limit, locale: locale, cancellationToken: cancellationToken);
        await SetCacheAsync(cacheKey, response, ListCacheDuration, cancellationToken);
        return response;
    }

    public async Task<PayloadRestaurant?> GetRestaurantByIdAsync(
        int id, string? locale = null, CancellationToken cancellationToken = default)
    {
        var cacheKey = $"restaurants:detail:{id}:{locale}";
        var cached = await GetFromCacheAsync<PayloadRestaurant>(cacheKey, cancellationToken);
        if (cached is not null) return cached;

        try
        {
            var response = await api.GetRestaurantByIdAsync(id, locale: locale, cancellationToken: cancellationToken);
            await SetCacheAsync(cacheKey, response, DetailCacheDuration, cancellationToken);
            return response;
        }
        catch (ApiException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound) { return null; }
    }

    public async Task<PayloadRestaurant?> GetRestaurantBySlugAsync(
        string slug, string? locale = null, CancellationToken cancellationToken = default)
    {
        var cacheKey = $"restaurants:slug:{slug}:{locale}";
        var cached = await GetFromCacheAsync<PayloadRestaurant>(cacheKey, cancellationToken);
        if (cached is not null) return cached;

        var response = await api.GetRestaurantsBySlugAsync(slug, locale: locale, cancellationToken: cancellationToken);
        var item = response.Docs.FirstOrDefault();
        if (item is not null) await SetCacheAsync(cacheKey, item, DetailCacheDuration, cancellationToken);
        return item;
    }

    #endregion

    #region Activities

    public async Task<PayloadPaginatedResponse<PayloadActivity>> GetActivitiesAsync(
        int page = 1, int limit = 10, string? locale = null,
        CancellationToken cancellationToken = default)
    {
        var cacheKey = $"activities:list:{page}:{limit}:{locale}";
        var cached = await GetFromCacheAsync<PayloadPaginatedResponse<PayloadActivity>>(cacheKey, cancellationToken);
        if (cached is not null) { logger.LogDebug("Cache hit for {CacheKey}", cacheKey); return cached; }

        logger.LogInformation("Fetching activities: page={Page}, limit={Limit}, locale={Locale}", page, limit, locale);
        var response = await api.GetActivitiesAsync(page: page, limit: limit, locale: locale, cancellationToken: cancellationToken);
        await SetCacheAsync(cacheKey, response, ListCacheDuration, cancellationToken);
        return response;
    }

    public async Task<PayloadActivity?> GetActivityByIdAsync(
        int id, string? locale = null, CancellationToken cancellationToken = default)
    {
        var cacheKey = $"activities:detail:{id}:{locale}";
        var cached = await GetFromCacheAsync<PayloadActivity>(cacheKey, cancellationToken);
        if (cached is not null) return cached;

        try
        {
            var response = await api.GetActivityByIdAsync(id, locale: locale, cancellationToken: cancellationToken);
            await SetCacheAsync(cacheKey, response, DetailCacheDuration, cancellationToken);
            return response;
        }
        catch (ApiException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound) { return null; }
    }

    public async Task<PayloadActivity?> GetActivityBySlugAsync(
        string slug, string? locale = null, CancellationToken cancellationToken = default)
    {
        var cacheKey = $"activities:slug:{slug}:{locale}";
        var cached = await GetFromCacheAsync<PayloadActivity>(cacheKey, cancellationToken);
        if (cached is not null) return cached;

        var response = await api.GetActivitiesBySlugAsync(slug, locale: locale, cancellationToken: cancellationToken);
        var item = response.Docs.FirstOrDefault();
        if (item is not null) await SetCacheAsync(cacheKey, item, DetailCacheDuration, cancellationToken);
        return item;
    }

    #endregion

    #region Cities

    public async Task<PayloadPaginatedResponse<PayloadCityDocument>> GetCitiesAsync(
        int limit = 500, string? locale = null,
        CancellationToken cancellationToken = default)
    {
        var cacheKey = $"cities:list:{locale}";
        var cached = await GetFromCacheAsync<PayloadPaginatedResponse<PayloadCityDocument>>(cacheKey, cancellationToken);
        if (cached is not null) { logger.LogDebug("Cache hit for {CacheKey}", cacheKey); return cached; }

        logger.LogInformation("Fetching cities: locale={Locale}", locale);
        var response = await api.GetCitiesAsync(limit: limit, locale: locale, cancellationToken: cancellationToken);
        await SetCacheAsync(cacheKey, response, ListCacheDuration, cancellationToken);
        return response;
    }

    #endregion

    #region Categories

    public async Task<PayloadPaginatedResponse<PayloadCategory>> GetCategoriesAsync(
        string? locale = null, CancellationToken cancellationToken = default)
    {
        var cacheKey = $"categories:list:{locale}";
        var cached = await GetFromCacheAsync<PayloadPaginatedResponse<PayloadCategory>>(cacheKey, cancellationToken);
        if (cached is not null) return cached;

        logger.LogInformation("Fetching categories: locale={Locale}", locale);
        var response = await api.GetCategoriesAsync(locale: locale, cancellationToken: cancellationToken);
        await SetCacheAsync(cacheKey, response, ListCacheDuration, cancellationToken);
        return response;
    }

    #endregion

    #region Settings Global

    public async Task<PayloadSettings?> GetSettingsAsync(
        string? locale = null, CancellationToken cancellationToken = default)
    {
        var cacheKey = $"settings:global:{locale}";
        var cached = await GetFromCacheAsync<PayloadSettings>(cacheKey, cancellationToken);
        if (cached is not null) { logger.LogDebug("Cache hit for {CacheKey}", cacheKey); return cached; }

        try
        {
            var response = await api.GetSettingsGlobalAsync(locale: locale, cancellationToken: cancellationToken);
            await SetCacheAsync(cacheKey, response, DetailCacheDuration, cancellationToken);
            return response;
        }
        catch (ApiException ex)
        {
            logger.LogWarning(ex, "Failed to fetch settings global from Payload (status={Status})", ex.StatusCode);
            return null;
        }
    }

    #endregion

    #region Structured Search

    /// <summary>
    /// Forwards a structured experience search to the Payload custom
    /// endpoint which reuses the exact same <c>searchExperiences()</c>
    /// logic the web frontend runs — so facet AND/OR modes, admin facet
    /// config and all other behaviours stay in sync between platforms.
    /// Responses are not cached (query shape is high-cardinality).
    /// </summary>
    public Task<ExperienceSearchResponse?> SearchExperiencesAsync(
        ExperienceSearchRequest request,
        CancellationToken cancellationToken = default)
        => TryCallAsync("search/experiences",
            ct => api.SearchExperiencesAsync(request, ct),
            cancellationToken);

    public Task<MapSearchResponse?> SearchMapAsync(
        MapSearchRequest request,
        CancellationToken cancellationToken = default)
        => TryCallAsync("search/map",
            ct => api.SearchMapAsync(request, ct),
            cancellationToken);

    /// <summary>
    /// Returns the admin-configured facet definitions. Cached for
    /// <see cref="ListCacheDuration"/> — changes in Payload admin are
    /// picked up on the next cache miss.
    /// </summary>
    public async Task<List<FacetConfigItem>?> GetFacetConfigAsync(
        CancellationToken cancellationToken = default)
    {
        const string cacheKey = "search:facet-config";
        var cached = await GetFromCacheAsync<List<FacetConfigItem>>(cacheKey, cancellationToken);
        if (cached is not null) return cached;

        var response = await TryCallAsync("search/facet-config",
            ct => api.GetFacetConfigAsync(ct),
            cancellationToken);
        if (response is not null)
            await SetCacheAsync(cacheKey, response, ListCacheDuration, cancellationToken);
        return response;
    }

    /// <summary>
    /// Runs a single Payload API call, logging <see cref="ApiException"/>
    /// uniformly and returning <c>null</c> on failure so controllers can
    /// convert it to a clean 502. Centralizes the three-line try/catch
    /// that every Payload forwarder would otherwise repeat.
    /// </summary>
    private async Task<T?> TryCallAsync<T>(
        string operation,
        Func<CancellationToken, Task<T>> call,
        CancellationToken cancellationToken) where T : class
    {
        try
        {
            return await call(cancellationToken);
        }
        catch (ApiException ex)
        {
            logger.LogWarning(ex, "Payload {Operation} failed (status={Status})", operation, ex.StatusCode);
            return null;
        }
    }

    #endregion

    #region Cache Helpers

    private async Task<T?> GetFromCacheAsync<T>(string key, CancellationToken cancellationToken) where T : class
    {
        try
        {
            var cached = await cache.GetStringAsync(key, cancellationToken);
            if (cached is not null) return JsonSerializer.Deserialize<T>(cached, JsonOptions);
        }
        catch (Exception ex) { logger.LogWarning(ex, "Failed to get from cache: {Key}", key); }
        return null;
    }

    private async Task SetCacheAsync<T>(string key, T value, TimeSpan duration, CancellationToken cancellationToken)
    {
        try
        {
            var json = JsonSerializer.Serialize(value, JsonOptions);
            await cache.SetStringAsync(key, json, new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = duration
            }, cancellationToken);
        }
        catch (Exception ex) { logger.LogWarning(ex, "Failed to set cache: {Key}", key); }
    }

    #endregion
}
