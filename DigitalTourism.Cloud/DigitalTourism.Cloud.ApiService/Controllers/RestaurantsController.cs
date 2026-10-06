using DigitalTourism.Cloud.ApiService.Models;
using DigitalTourism.Cloud.ApiService.Services;
using Microsoft.AspNetCore.Mvc;

namespace DigitalTourism.Cloud.ApiService.Controllers;

[ApiController]
[Route("v1/restaurants")]
public class RestaurantsController(PayloadCmsService payloadCms, ILogger<RestaurantsController> logger) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(RestaurantListResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetRestaurants(
        [FromQuery] int page = 1, [FromQuery] int limit = 10, [FromQuery] string? locale = "en",
        CancellationToken cancellationToken = default)
    {
        page = Math.Max(1, page);
        limit = Math.Clamp(limit, 1, 100);

        logger.LogInformation("Getting restaurants: page={Page}, limit={Limit}, locale={Locale}", page, limit, locale);
        var response = await payloadCms.GetRestaurantsAsync(page, limit, locale, cancellationToken);

        return Ok(new RestaurantListResponse
        {
            Data = response.Docs.Select(MapToListItem).ToList(),
            Page = response.Page, Limit = response.Limit, Total = response.TotalDocs,
            TotalPages = response.TotalPages, HasNextPage = response.HasNextPage, HasPrevPage = response.HasPrevPage
        });
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(RestaurantDetail), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetRestaurant(int id, [FromQuery] string? locale = "en", CancellationToken cancellationToken = default)
    {
        var item = await payloadCms.GetRestaurantByIdAsync(id, locale, cancellationToken);
        return item is null ? NotFound(new { Error = "Restaurant not found", Id = id }) : Ok(MapToDetail(item));
    }

    [HttpGet("by-slug/{slug}")]
    [ProducesResponseType(typeof(RestaurantDetail), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetRestaurantBySlug(string slug, [FromQuery] string? locale = "en", CancellationToken cancellationToken = default)
    {
        var item = await payloadCms.GetRestaurantBySlugAsync(slug, locale, cancellationToken);
        return item is null ? NotFound(new { Error = "Restaurant not found", Slug = slug }) : Ok(MapToDetail(item));
    }

    private static Restaurant MapToListItem(PayloadRestaurant src) => new()
    {
        Id = src.Id, Name = src.Title, Slug = src.Slug,
        Description = src.Meta?.Description,
        Category = ExperienceMapper.MapCategory(src.Categories?.FirstOrDefault()),
        ImageUrl = src.HeroImage?.Url,
        ThumbnailUrl = src.HeroImage?.Sizes?.Thumbnail?.Url ?? src.HeroImage?.Url,
        Location = ExperienceMapper.MapLocation(src.Location),
        CityId = src.City?.Id, CityName = src.City?.Name,
        CuisineTypes = ExperienceMapper.MapTaxonomyItems(src.CuisineType),
        PublishedAt = src.PublishedAt
    };

    private static RestaurantDetail MapToDetail(PayloadRestaurant src) => new()
    {
        Id = src.Id, Name = src.Title, Slug = src.Slug,
        Description = src.Meta?.Description, Content = src.Description,
        Category = ExperienceMapper.MapCategory(src.Categories?.FirstOrDefault()),
        Categories = ExperienceMapper.MapCategories(src.Categories),
        Tags = ExperienceMapper.MapTags(src.Tags),
        ImageUrl = src.HeroImage?.Url,
        ThumbnailUrl = src.HeroImage?.Sizes?.Thumbnail?.Url ?? src.HeroImage?.Url,
        Images = ExperienceMapper.MapImages(src.HeroImage, src.Gallery),
        Videos = ExperienceMapper.MapVideos(src.Videos),
        Brochures = ExperienceMapper.MapBrochures(src.Brochures),
        Location = ExperienceMapper.MapLocation(src.Location),
        Contact = ExperienceMapper.MapContact(src.Contact),
        CityId = src.City?.Id, CityName = src.City?.Name,
        MunicipalityName = ExperienceMapper.GetMunicipalityName(src.City?.Municipality),
        RelatedExperiences = src.RelatedExperiences,
        WorkingHours = src.WorkingHours, HowToGetThere = src.HowToGetThere,
        PracticalInfo = src.PracticalInfo, InfoCenter = src.InfoCenter,
        ContactInfoRichText = src.ContactInfo,
        CuisineTypes = ExperienceMapper.MapTaxonomyItems(src.CuisineType),
        DietaryOptions = ExperienceMapper.MapTaxonomyItems(src.DietaryOptions),
        RestaurantHours = src.RestaurantHours?.Select(h => new RestaurantHoursInfo
        {
            Days = h.Days, OpenTime = h.OpenTime, CloseTime = h.CloseTime
        }).ToList(),
        MenuUrl = src.MenuUrl, ReservationUrl = src.ReservationUrl,
        BookingUrl = src.BookingUrl, PriceRange = src.PriceRange,
        PublishedAt = src.PublishedAt, CreatedAt = src.CreatedAt, UpdatedAt = src.UpdatedAt
    };
}

#region Restaurant Response Models

public record RestaurantListResponse
{
    public List<Restaurant> Data { get; init; } = [];
    public int Page { get; init; }
    public int Limit { get; init; }
    public int Total { get; init; }
    public int TotalPages { get; init; }
    public bool HasNextPage { get; init; }
    public bool HasPrevPage { get; init; }
}

public record Restaurant
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? Slug { get; init; }
    public string? Description { get; init; }
    public CategorySummary? Category { get; init; }
    public string? ImageUrl { get; init; }
    public string? ThumbnailUrl { get; init; }
    public LocationInfo? Location { get; init; }
    public int? CityId { get; init; }
    public string? CityName { get; init; }
    public List<TaxonomyItemInfo>? CuisineTypes { get; init; }
    public DateTime? PublishedAt { get; init; }
}

public record RestaurantDetail : Restaurant
{
    public object? Content { get; init; }
    public List<CategoryInfo>? Categories { get; init; }
    public List<TagInfo>? Tags { get; init; }
    public List<ImageInfo>? Images { get; init; }
    public List<VideoInfo>? Videos { get; init; }
    public List<BrochureInfo>? Brochures { get; init; }
    public ContactInfo? Contact { get; init; }
    public string? MunicipalityName { get; init; }
    public List<PayloadPolymorphicRelation>? RelatedExperiences { get; init; }
    public object? WorkingHours { get; init; }
    public object? HowToGetThere { get; init; }
    public object? PracticalInfo { get; init; }
    public object? InfoCenter { get; init; }
    public object? ContactInfoRichText { get; init; }
    public List<TaxonomyItemInfo>? DietaryOptions { get; init; }
    public List<RestaurantHoursInfo>? RestaurantHours { get; init; }
    public string? MenuUrl { get; init; }
    public string? ReservationUrl { get; init; }
    public string? BookingUrl { get; init; }
    public string? PriceRange { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; init; }
}

public record RestaurantHoursInfo
{
    public List<string>? Days { get; init; }
    public string? OpenTime { get; init; }
    public string? CloseTime { get; init; }
}

#endregion
