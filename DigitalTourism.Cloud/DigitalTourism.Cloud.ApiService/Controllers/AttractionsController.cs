using DigitalTourism.Cloud.ApiService.Models;
using DigitalTourism.Cloud.ApiService.Services;
using Microsoft.AspNetCore.Mvc;

namespace DigitalTourism.Cloud.ApiService.Controllers;

[ApiController]
[Route("v1/attractions")]
public class AttractionsController(PayloadCmsService payloadCms, ILogger<AttractionsController> logger) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(AttractionListResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAttractions(
        [FromQuery] int page = 1, [FromQuery] int limit = 10,
        [FromQuery] string? locale = "en", [FromQuery] string? category = null,
        CancellationToken cancellationToken = default)
    {
        page = Math.Max(1, page);
        limit = Math.Clamp(limit, 1, 100);

        logger.LogInformation("Getting attractions: page={Page}, limit={Limit}, locale={Locale}, category={Category}", page, limit, locale, category);
        var response = await payloadCms.GetAttractionsAsync(page, limit, locale, category, cancellationToken);

        return Ok(new AttractionListResponse
        {
            Data = response.Docs.Select(MapToListItem).ToList(),
            Page = response.Page, Limit = response.Limit, Total = response.TotalDocs,
            TotalPages = response.TotalPages, HasNextPage = response.HasNextPage, HasPrevPage = response.HasPrevPage
        });
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(AttractionDetail), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAttraction(int id, [FromQuery] string? locale = "en", CancellationToken cancellationToken = default)
    {
        var item = await payloadCms.GetAttractionByIdAsync(id, locale, cancellationToken);
        return item is null ? NotFound(new { Error = "Attraction not found", Id = id }) : Ok(MapToDetail(item));
    }

    [HttpGet("by-slug/{slug}")]
    [ProducesResponseType(typeof(AttractionDetail), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAttractionBySlug(string slug, [FromQuery] string? locale = "en", CancellationToken cancellationToken = default)
    {
        var item = await payloadCms.GetAttractionBySlugAsync(slug, locale, cancellationToken);
        return item is null ? NotFound(new { Error = "Attraction not found", Slug = slug }) : Ok(MapToDetail(item));
    }

    private static Attraction MapToListItem(PayloadAttraction src) => new()
    {
        Id = src.Id, Name = src.Title, Slug = src.Slug,
        Description = src.Meta?.Description,
        Category = ExperienceMapper.MapCategory(src.Categories?.FirstOrDefault()),
        ImageUrl = src.HeroImage?.Url,
        ThumbnailUrl = src.HeroImage?.Sizes?.Thumbnail?.Url ?? src.HeroImage?.Url,
        Location = ExperienceMapper.MapLocation(src.Location),
        CityId = src.City?.Id, CityName = src.City?.Name,
        PublishedAt = src.PublishedAt
    };

    private static AttractionDetail MapToDetail(PayloadAttraction src) => new()
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
        VisitDuration = src.VisitDuration, AttractionHours = src.AttractionHours,
        PublishedAt = src.PublishedAt, CreatedAt = src.CreatedAt, UpdatedAt = src.UpdatedAt
    };
}

#region Attraction Response Models

public record AttractionListResponse
{
    public List<Attraction> Data { get; init; } = [];
    public int Page { get; init; }
    public int Limit { get; init; }
    public int Total { get; init; }
    public int TotalPages { get; init; }
    public bool HasNextPage { get; init; }
    public bool HasPrevPage { get; init; }
}

public record Attraction
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
    public DateTime? PublishedAt { get; init; }
}

public record AttractionDetail : Attraction
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
    public double? VisitDuration { get; init; }
    public string? AttractionHours { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; init; }
}

#endregion
