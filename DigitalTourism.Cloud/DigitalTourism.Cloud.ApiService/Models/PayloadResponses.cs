using System.Text.Json.Serialization;

namespace DigitalTourism.Cloud.ApiService.Models;

/// <summary>
/// Generic paginated response from Payload CMS API
/// </summary>
public record PayloadPaginatedResponse<T>
{
    [JsonPropertyName("docs")]
    public List<T> Docs { get; init; } = [];

    [JsonPropertyName("totalDocs")]
    public int TotalDocs { get; init; }

    [JsonPropertyName("limit")]
    public int Limit { get; init; }

    [JsonPropertyName("totalPages")]
    public int TotalPages { get; init; }

    [JsonPropertyName("page")]
    public int Page { get; init; }

    [JsonPropertyName("pagingCounter")]
    public int PagingCounter { get; init; }

    [JsonPropertyName("hasPrevPage")]
    public bool HasPrevPage { get; init; }

    [JsonPropertyName("hasNextPage")]
    public bool HasNextPage { get; init; }

    [JsonPropertyName("prevPage")]
    public int? PrevPage { get; init; }

    [JsonPropertyName("nextPage")]
    public int? NextPage { get; init; }
}

#region Experience Collections

/// <summary>
/// Shared fields across all experience collections (attractions, events, hotels, restaurants, activities).
/// Mirrors the fields defined in createExperienceCollection.ts.
/// Requires depth >= 1 for populated relationships.
/// </summary>
public abstract record PayloadExperienceBase
{
    [JsonPropertyName("id")]
    public int Id { get; init; }

    [JsonPropertyName("title")]
    public string Title { get; init; } = string.Empty;

    [JsonPropertyName("slug")]
    public string? Slug { get; init; }

    [JsonPropertyName("description")]
    public object? Description { get; init; }

    [JsonPropertyName("heroImage")]
    public PayloadMedia? HeroImage { get; init; }

    [JsonPropertyName("gallery")]
    public List<PayloadMedia>? Gallery { get; init; }

    [JsonPropertyName("videos")]
    public List<PayloadVideo>? Videos { get; init; }

    [JsonPropertyName("brochures")]
    public List<PayloadBrochure>? Brochures { get; init; }

    [JsonPropertyName("categories")]
    public List<PayloadCategory>? Categories { get; init; }

    [JsonPropertyName("tags")]
    public List<PayloadTag>? Tags { get; init; }

    [JsonPropertyName("city")]
    public PayloadCity? City { get; init; }

    [JsonPropertyName("location")]
    public PayloadLocation? Location { get; init; }

    [JsonPropertyName("contact")]
    public PayloadContact? Contact { get; init; }

    [JsonPropertyName("relatedExperiences")]
    public List<PayloadPolymorphicRelation>? RelatedExperiences { get; init; }

    // Visitor information (Lexical richText)
    [JsonPropertyName("workingHours")]
    public object? WorkingHours { get; init; }

    [JsonPropertyName("howToGetThere")]
    public object? HowToGetThere { get; init; }

    [JsonPropertyName("practicalInfo")]
    public object? PracticalInfo { get; init; }

    [JsonPropertyName("infoCenter")]
    public object? InfoCenter { get; init; }

    [JsonPropertyName("contactInfo")]
    public object? ContactInfo { get; init; }

    [JsonPropertyName("meta")]
    public PayloadMeta? Meta { get; init; }

    [JsonPropertyName("publishedAt")]
    public DateTime? PublishedAt { get; init; }

    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; init; }

    [JsonPropertyName("updatedAt")]
    public DateTime UpdatedAt { get; init; }
}

/// <summary>
/// Payload CMS Attraction (collection slug: "attractions")
/// </summary>
public record PayloadAttraction : PayloadExperienceBase
{
    [JsonPropertyName("visitDuration")]
    public double? VisitDuration { get; init; }

    [JsonPropertyName("attractionHours")]
    public string? AttractionHours { get; init; }
}

/// <summary>
/// Payload CMS Event (collection slug: "events")
/// </summary>
public record PayloadEvent : PayloadExperienceBase
{
    [JsonPropertyName("subtitle")]
    public string? Subtitle { get; init; }

    [JsonPropertyName("duration")]
    public string? Duration { get; init; }

    [JsonPropertyName("period")]
    public PayloadPeriod? Period { get; init; }

    [JsonPropertyName("allDay")]
    public bool? AllDay { get; init; }

    [JsonPropertyName("ticketPriceLabel")]
    public string? TicketPriceLabel { get; init; }

    [JsonPropertyName("organizer")]
    public string? Organizer { get; init; }

    [JsonPropertyName("organizerDescription")]
    public object? OrganizerDescription { get; init; }

    [JsonPropertyName("organizerHighlights")]
    public List<PayloadMedia>? OrganizerHighlights { get; init; }

    [JsonPropertyName("registrationUrl")]
    public string? RegistrationUrl { get; init; }
}

/// <summary>
/// Payload CMS Hotel (collection slug: "hotels")
/// </summary>
public record PayloadHotel : PayloadExperienceBase
{
    [JsonPropertyName("starRating")]
    public string? StarRating { get; init; }

    [JsonPropertyName("rooms")]
    public int? Rooms { get; init; }

    [JsonPropertyName("amenities")]
    public List<PayloadTag>? Amenities { get; init; }

    [JsonPropertyName("checkInTime")]
    public string? CheckInTime { get; init; }

    [JsonPropertyName("checkOutTime")]
    public string? CheckOutTime { get; init; }

    [JsonPropertyName("bookingUrl")]
    public string? BookingUrl { get; init; }
}

/// <summary>
/// Payload CMS Restaurant (collection slug: "restaurants")
/// </summary>
public record PayloadRestaurant : PayloadExperienceBase
{
    [JsonPropertyName("cuisineType")]
    public List<PayloadTag>? CuisineType { get; init; }

    [JsonPropertyName("dietaryOptions")]
    public List<PayloadTag>? DietaryOptions { get; init; }

    [JsonPropertyName("restaurantHours")]
    public List<PayloadRestaurantHours>? RestaurantHours { get; init; }

    [JsonPropertyName("menuUrl")]
    public string? MenuUrl { get; init; }

    [JsonPropertyName("reservationUrl")]
    public string? ReservationUrl { get; init; }

    [JsonPropertyName("bookingUrl")]
    public string? BookingUrl { get; init; }

    [JsonPropertyName("priceRange")]
    public string? PriceRange { get; init; }
}

/// <summary>
/// Payload CMS Activity (collection slug: "activities")
/// </summary>
public record PayloadActivity : PayloadExperienceBase
{
    [JsonPropertyName("duration")]
    public string? Duration { get; init; }

    [JsonPropertyName("difficultyLevel")]
    public PayloadTag? DifficultyLevel { get; init; }

    [JsonPropertyName("seasonality")]
    public List<PayloadTag>? Seasonality { get; init; }

    [JsonPropertyName("minimumAge")]
    public int? MinimumAge { get; init; }

    [JsonPropertyName("groupSize")]
    public PayloadGroupSize? GroupSize { get; init; }

    [JsonPropertyName("equipmentProvided")]
    public bool? EquipmentProvided { get; init; }

    [JsonPropertyName("whatToBring")]
    public string? WhatToBring { get; init; }

    [JsonPropertyName("includes")]
    public List<PayloadIncludeItem>? Includes { get; init; }

    [JsonPropertyName("bookingUrl")]
    public string? BookingUrl { get; init; }
}

#endregion

#region Cities

/// <summary>
/// Payload CMS City (full document from /api/cities)
/// </summary>
public record PayloadCityDocument
{
    [JsonPropertyName("id")]
    public int Id { get; init; }

    [JsonPropertyName("name")]
    public string Name { get; init; } = string.Empty;

    [JsonPropertyName("coordinates")]
    public PayloadCoordinates? Coordinates { get; init; }

    [JsonPropertyName("heroImage")]
    public PayloadMedia? HeroImage { get; init; }

    [JsonPropertyName("municipality")]
    public System.Text.Json.JsonElement? Municipality { get; init; }

    [JsonPropertyName("population")]
    public int? Population { get; init; }

    [JsonPropertyName("isCapital")]
    public bool? IsCapital { get; init; }

    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; init; }

    [JsonPropertyName("updatedAt")]
    public DateTime UpdatedAt { get; init; }
}

#endregion

#region Shared Payload Types

/// <summary>
/// Payload CMS Category
/// </summary>
public record PayloadCategory
{
    [JsonPropertyName("id")]
    public int Id { get; init; }

    [JsonPropertyName("title")]
    public string Title { get; init; } = string.Empty;

    [JsonPropertyName("slug")]
    public string? Slug { get; init; }
}

/// <summary>
/// Payload CMS Tag or taxonomy item (tags, amenities, cuisine-types, dietary-options, difficulty-levels, seasons)
/// </summary>
public record PayloadTag
{
    [JsonPropertyName("id")]
    public int Id { get; init; }

    [JsonPropertyName("title")]
    public string Title { get; init; } = string.Empty;

    [JsonPropertyName("name")]
    public string? Name { get; init; }

    [JsonPropertyName("slug")]
    public string? Slug { get; init; }

    [JsonPropertyName("icon")]
    public string? Icon { get; init; }

    /// <summary>Display name: prefers title, falls back to name</summary>
    [JsonIgnore]
    public string DisplayName => !string.IsNullOrEmpty(Title) ? Title : Name ?? string.Empty;
}

/// <summary>
/// Payload CMS City (populated relationship within an experience)
/// </summary>
public record PayloadCity
{
    [JsonPropertyName("id")]
    public int Id { get; init; }

    [JsonPropertyName("name")]
    public string Name { get; init; } = string.Empty;

    [JsonPropertyName("coordinates")]
    public PayloadCoordinates? Coordinates { get; init; }

    [JsonPropertyName("heroImage")]
    public PayloadMedia? HeroImage { get; init; }

    [JsonPropertyName("municipality")]
    public System.Text.Json.JsonElement? Municipality { get; init; }
}

/// <summary>
/// Payload CMS Media
/// </summary>
public record PayloadMedia
{
    [JsonPropertyName("id")]
    public int Id { get; init; }

    [JsonPropertyName("alt")]
    public string? Alt { get; init; }

    [JsonPropertyName("url")]
    public string? Url { get; init; }

    [JsonPropertyName("filename")]
    public string? Filename { get; init; }

    [JsonPropertyName("mimeType")]
    public string? MimeType { get; init; }

    [JsonPropertyName("width")]
    public int? Width { get; init; }

    [JsonPropertyName("height")]
    public int? Height { get; init; }

    [JsonPropertyName("sizes")]
    public PayloadMediaSizes? Sizes { get; init; }
}

/// <summary>
/// Payload CMS Media Sizes
/// </summary>
public record PayloadMediaSizes
{
    [JsonPropertyName("thumbnail")]
    public PayloadMediaSize? Thumbnail { get; init; }

    [JsonPropertyName("card")]
    public PayloadMediaSize? Card { get; init; }

    [JsonPropertyName("tablet")]
    public PayloadMediaSize? Tablet { get; init; }
}

/// <summary>
/// Payload CMS Media Size
/// </summary>
public record PayloadMediaSize
{
    [JsonPropertyName("url")]
    public string? Url { get; init; }

    [JsonPropertyName("width")]
    public int? Width { get; init; }

    [JsonPropertyName("height")]
    public int? Height { get; init; }
}

/// <summary>
/// Payload CMS Meta (SEO)
/// </summary>
public record PayloadMeta
{
    [JsonPropertyName("title")]
    public string? Title { get; init; }

    [JsonPropertyName("description")]
    public string? Description { get; init; }

    [JsonPropertyName("image")]
    public PayloadMedia? Image { get; init; }
}

/// <summary>
/// Location group with address and coordinates
/// </summary>
public record PayloadLocation
{
    [JsonPropertyName("address")]
    public string? Address { get; init; }

    [JsonPropertyName("coordinates")]
    public PayloadCoordinates? Coordinates { get; init; }
}

/// <summary>
/// GPS coordinates
/// </summary>
public record PayloadCoordinates
{
    [JsonPropertyName("latitude")]
    public double? Latitude { get; init; }

    [JsonPropertyName("longitude")]
    public double? Longitude { get; init; }
}

/// <summary>
/// Contact information group
/// </summary>
public record PayloadContact
{
    [JsonPropertyName("phone")]
    public string? Phone { get; init; }

    [JsonPropertyName("email")]
    public string? Email { get; init; }

    [JsonPropertyName("website")]
    public string? Website { get; init; }
}

/// <summary>
/// Video array item
/// </summary>
public record PayloadVideo
{
    [JsonPropertyName("title")]
    public string? Title { get; init; }

    [JsonPropertyName("url")]
    public string Url { get; init; } = string.Empty;
}

/// <summary>
/// Brochure array item
/// </summary>
public record PayloadBrochure
{
    [JsonPropertyName("file")]
    public PayloadMedia? File { get; init; }

    [JsonPropertyName("title")]
    public string? Title { get; init; }
}

/// <summary>
/// Event period with start and end dates
/// </summary>
public record PayloadPeriod
{
    [JsonPropertyName("startDate")]
    public DateTime? StartDate { get; init; }

    [JsonPropertyName("endDate")]
    public DateTime? EndDate { get; init; }
}

/// <summary>
/// Restaurant hours entry
/// </summary>
public record PayloadRestaurantHours
{
    [JsonPropertyName("days")]
    public List<string>? Days { get; init; }

    [JsonPropertyName("openTime")]
    public string? OpenTime { get; init; }

    [JsonPropertyName("closeTime")]
    public string? CloseTime { get; init; }
}

/// <summary>
/// Activity group size
/// </summary>
public record PayloadGroupSize
{
    [JsonPropertyName("min")]
    public int? Min { get; init; }

    [JsonPropertyName("max")]
    public int? Max { get; init; }
}

/// <summary>
/// Activity includes item
/// </summary>
public record PayloadIncludeItem
{
    [JsonPropertyName("label")]
    public string? Label { get; init; }
}

/// <summary>
/// Polymorphic relationship (e.g., relatedExperiences)
/// </summary>
public record PayloadPolymorphicRelation
{
    [JsonPropertyName("relationTo")]
    public string? RelationTo { get; init; }

    [JsonPropertyName("value")]
    public object? Value { get; init; }
}

#endregion

#region Settings Global

/// <summary>
/// Minimal shape of the Payload `settings` global. Only fields the API
/// Service actually needs are declared — unknown fields (newsletter
/// credentials, facet config, etc.) are ignored by the JSON deserializer.
/// </summary>
public record PayloadSettings
{
    [JsonPropertyName("privacyPolicyPage")]
    public PayloadPageReference? PrivacyPolicyPage { get; init; }

    [JsonPropertyName("termsOfConditionsPage")]
    public PayloadPageReference? TermsOfConditionsPage { get; init; }
}

/// <summary>
/// A populated relationship to a Payload `pages` document, restricted to
/// the fields we need to build a public web URL.
/// </summary>
public record PayloadPageReference
{
    [JsonPropertyName("id")]
    public int Id { get; init; }

    [JsonPropertyName("slug")]
    public string? Slug { get; init; }

    [JsonPropertyName("breadcrumbs")]
    public List<PayloadPageBreadcrumb>? Breadcrumbs { get; init; }
}

public record PayloadPageBreadcrumb
{
    [JsonPropertyName("url")]
    public string? Url { get; init; }

    [JsonPropertyName("label")]
    public string? Label { get; init; }
}

#endregion
