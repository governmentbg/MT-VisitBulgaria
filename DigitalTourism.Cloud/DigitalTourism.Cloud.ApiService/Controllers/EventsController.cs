using DigitalTourism.Cloud.ApiService.Models;
using DigitalTourism.Cloud.ApiService.Services;
using Microsoft.AspNetCore.Mvc;

namespace DigitalTourism.Cloud.ApiService.Controllers;

[ApiController]
[Route("v1/events")]
public class EventsController(PayloadCmsService payloadCms, ILogger<EventsController> logger) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(EventListResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetEvents(
        [FromQuery] int page = 1, [FromQuery] int limit = 10,
        [FromQuery] string? locale = "en", [FromQuery] string? status = null,
        CancellationToken cancellationToken = default)
    {
        page = Math.Max(1, page);
        limit = Math.Clamp(limit, 1, 100);

        logger.LogInformation("Getting events: page={Page}, limit={Limit}, locale={Locale}", page, limit, locale);
        var response = await payloadCms.GetEventsAsync(page, limit, locale, cancellationToken);

        return Ok(new EventListResponse
        {
            Data = response.Docs.Select(MapToListItem).ToList(),
            Page = response.Page, Limit = response.Limit, Total = response.TotalDocs,
            TotalPages = response.TotalPages, HasNextPage = response.HasNextPage, HasPrevPage = response.HasPrevPage
        });
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(EventDetail), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetEvent(int id, [FromQuery] string? locale = "en", CancellationToken cancellationToken = default)
    {
        var item = await payloadCms.GetEventByIdAsync(id, locale, cancellationToken);
        return item is null ? NotFound(new { Error = "Event not found", Id = id }) : Ok(MapToDetail(item));
    }

    [HttpGet("by-slug/{slug}")]
    [ProducesResponseType(typeof(EventDetail), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetEventBySlug(string slug, [FromQuery] string? locale = "en", CancellationToken cancellationToken = default)
    {
        var item = await payloadCms.GetEventBySlugAsync(slug, locale, cancellationToken);
        return item is null ? NotFound(new { Error = "Event not found", Slug = slug }) : Ok(MapToDetail(item));
    }

    private static Event MapToListItem(PayloadEvent src) => new()
    {
        Id = src.Id, Name = src.Title, Slug = src.Slug,
        Subtitle = src.Subtitle,
        Description = src.Meta?.Description,
        Category = ExperienceMapper.MapCategory(src.Categories?.FirstOrDefault()),
        ImageUrl = src.HeroImage?.Url,
        ThumbnailUrl = src.HeroImage?.Sizes?.Thumbnail?.Url ?? src.HeroImage?.Url,
        Location = ExperienceMapper.MapLocation(src.Location),
        CityId = src.City?.Id, CityName = src.City?.Name,
        Period = src.Period is not null ? new PeriodInfo { StartDate = src.Period.StartDate, EndDate = src.Period.EndDate } : null,
        AllDay = src.AllDay, Organizer = src.Organizer,
        PublishedAt = src.PublishedAt
    };

    private static EventDetail MapToDetail(PayloadEvent src) => new()
    {
        Id = src.Id, Name = src.Title, Slug = src.Slug,
        Subtitle = src.Subtitle,
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
        Period = src.Period is not null ? new PeriodInfo { StartDate = src.Period.StartDate, EndDate = src.Period.EndDate } : null,
        AllDay = src.AllDay, Duration = src.Duration,
        TicketPriceLabel = src.TicketPriceLabel, Organizer = src.Organizer,
        OrganizerDescription = src.OrganizerDescription,
        OrganizerHighlights = src.OrganizerHighlights?.Select(m => new ImageInfo { Url = m.Url, Alt = m.Alt, Width = m.Width, Height = m.Height }).ToList(),
        RegistrationUrl = src.RegistrationUrl,
        PublishedAt = src.PublishedAt, CreatedAt = src.CreatedAt, UpdatedAt = src.UpdatedAt
    };
}

#region Event Response Models

public record EventListResponse
{
    public List<Event> Data { get; init; } = [];
    public int Page { get; init; }
    public int Limit { get; init; }
    public int Total { get; init; }
    public int TotalPages { get; init; }
    public bool HasNextPage { get; init; }
    public bool HasPrevPage { get; init; }
}

public record Event
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? Slug { get; init; }
    public string? Subtitle { get; init; }
    public string? Description { get; init; }
    public CategorySummary? Category { get; init; }
    public string? ImageUrl { get; init; }
    public string? ThumbnailUrl { get; init; }
    public LocationInfo? Location { get; init; }
    public int? CityId { get; init; }
    public string? CityName { get; init; }
    public PeriodInfo? Period { get; init; }
    public bool? AllDay { get; init; }
    public string? Organizer { get; init; }
    public DateTime? PublishedAt { get; init; }
}

public record EventDetail : Event
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
    public string? Duration { get; init; }
    public string? TicketPriceLabel { get; init; }
    public object? OrganizerDescription { get; init; }
    public List<ImageInfo>? OrganizerHighlights { get; init; }
    public string? RegistrationUrl { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; init; }
}

#endregion
