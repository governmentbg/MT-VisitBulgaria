using System.Text.Json.Serialization;

namespace DigitalTourism.Cloud.ApiService.Models;

/// <summary>
/// DTOs for the new structured search endpoints exposed by Payload CMS at
/// <c>/api/search/experiences</c>, <c>/api/search/map</c>, and
/// <c>/api/search/facet-config</c>. Each record mirrors its TypeScript
/// counterpart in <c>lib/search/*</c> so the API Service can forward
/// mobile requests verbatim without re-implementing any filter logic.
/// </summary>
#region Shared

public record GeoPoint
{
    [JsonPropertyName("lat")] public double Lat { get; init; }
    [JsonPropertyName("lng")] public double Lng { get; init; }
}

public record GeoBoundingBox
{
    [JsonPropertyName("topLeft")] public GeoPoint TopLeft { get; init; } = new();
    [JsonPropertyName("bottomRight")] public GeoPoint BottomRight { get; init; } = new();
}

public record GeoRadius
{
    [JsonPropertyName("lat")] public double Lat { get; init; }
    [JsonPropertyName("lng")] public double Lng { get; init; }
    [JsonPropertyName("radiusKm")] public double RadiusKm { get; init; }
}

public record ExperienceSearchFilters
{
    [JsonPropertyName("type")] public List<string>? Type { get; init; }
    [JsonPropertyName("categories")] public List<string>? Categories { get; init; }
    [JsonPropertyName("tags")] public List<string>? Tags { get; init; }
    [JsonPropertyName("region")] public List<string>? Region { get; init; }
    [JsonPropertyName("municipality")] public List<string>? Municipality { get; init; }
    [JsonPropertyName("city")] public List<string>? City { get; init; }
    [JsonPropertyName("starRating")] public List<string>? StarRating { get; init; }
    [JsonPropertyName("amenities")] public List<string>? Amenities { get; init; }
    [JsonPropertyName("cuisineType")] public List<string>? CuisineType { get; init; }
    [JsonPropertyName("dietaryOptions")] public List<string>? DietaryOptions { get; init; }
    [JsonPropertyName("difficultyLevel")] public List<string>? DifficultyLevel { get; init; }
    [JsonPropertyName("seasonality")] public List<string>? Seasonality { get; init; }
    [JsonPropertyName("organizer")] public List<string>? Organizer { get; init; }

    [JsonPropertyName("geoBoundingBox")] public GeoBoundingBox? GeoBoundingBox { get; init; }
    [JsonPropertyName("geoRadius")] public GeoRadius? GeoRadius { get; init; }

    [JsonPropertyName("minimumAge")] public int? MinimumAge { get; init; }
    [JsonPropertyName("equipmentProvided")] public bool? EquipmentProvided { get; init; }

    [JsonPropertyName("dateFrom")] public long? DateFrom { get; init; }
    [JsonPropertyName("dateTo")] public long? DateTo { get; init; }
    [JsonPropertyName("dateEndAfter")] public long? DateEndAfter { get; init; }
}

public record FacetValue
{
    [JsonPropertyName("value")] public string Value { get; init; } = string.Empty;
    [JsonPropertyName("count")] public int Count { get; init; }
}

public record ExperienceLocation
{
    [JsonPropertyName("city")] public string? City { get; init; }
    [JsonPropertyName("municipality")] public string? Municipality { get; init; }
    [JsonPropertyName("region")] public string? Region { get; init; }
    [JsonPropertyName("coordinates")] public ExperienceCoordinates? Coordinates { get; init; }
}

public record ExperienceCoordinates
{
    [JsonPropertyName("latitude")] public double Latitude { get; init; }
    [JsonPropertyName("longitude")] public double Longitude { get; init; }
}

public record ExperienceHeroImage
{
    [JsonPropertyName("url")] public string? Url { get; init; }
    [JsonPropertyName("alt")] public string? Alt { get; init; }
}

public record ExperienceSearchResult
{
    [JsonPropertyName("id")] public string Id { get; init; } = string.Empty;
    [JsonPropertyName("title")] public string Title { get; init; } = string.Empty;
    [JsonPropertyName("slug")] public string Slug { get; init; } = string.Empty;
    [JsonPropertyName("type")] public string Type { get; init; } = string.Empty;
    [JsonPropertyName("description")] public string? Description { get; init; }
    [JsonPropertyName("categories")] public List<string>? Categories { get; init; }
    [JsonPropertyName("tags")] public List<string>? Tags { get; init; }
    [JsonPropertyName("location")] public ExperienceLocation? Location { get; init; }
    [JsonPropertyName("heroImage")] public ExperienceHeroImage? HeroImage { get; init; }
    [JsonPropertyName("starRating")] public double? StarRating { get; init; }
    [JsonPropertyName("amenities")] public List<string>? Amenities { get; init; }
    [JsonPropertyName("cuisineType")] public string? CuisineType { get; init; }
    [JsonPropertyName("dietaryOptions")] public List<string>? DietaryOptions { get; init; }
    [JsonPropertyName("difficultyLevel")] public string? DifficultyLevel { get; init; }
    [JsonPropertyName("seasonality")] public List<string>? Seasonality { get; init; }
    [JsonPropertyName("minimumAge")] public int? MinimumAge { get; init; }
    [JsonPropertyName("equipmentProvided")] public bool? EquipmentProvided { get; init; }
    [JsonPropertyName("organizer")] public string? Organizer { get; init; }
    [JsonPropertyName("date")] public string? Date { get; init; }
    [JsonPropertyName("endDate")] public string? EndDate { get; init; }
}

#endregion

#region Experiences search

public record ExperienceSearchRequest
{
    [JsonPropertyName("query")] public string? Query { get; init; }
    [JsonPropertyName("locale")] public string Locale { get; init; } = "en";
    [JsonPropertyName("page")] public int? Page { get; init; }
    [JsonPropertyName("perPage")] public int? PerPage { get; init; }
    [JsonPropertyName("filters")] public ExperienceSearchFilters? Filters { get; init; }
    [JsonPropertyName("sortBy")] public string? SortBy { get; init; }
    [JsonPropertyName("geoSort")] public GeoPoint? GeoSort { get; init; }
}

public record ExperienceSearchResponse
{
    [JsonPropertyName("hits")] public List<ExperienceSearchResult> Hits { get; init; } = new();
    [JsonPropertyName("found")] public int Found { get; init; }
    [JsonPropertyName("page")] public int Page { get; init; }
    [JsonPropertyName("totalPages")] public int TotalPages { get; init; }
    [JsonPropertyName("searchTimeMs")] public int SearchTimeMs { get; init; }
    [JsonPropertyName("facets")] public Dictionary<string, List<FacetValue>>? Facets { get; init; }
}

#endregion

#region Map search

public record MapSearchRequest
{
    [JsonPropertyName("query")] public string? Query { get; init; }
    [JsonPropertyName("locale")] public string Locale { get; init; } = "en";
    [JsonPropertyName("filters")] public ExperienceSearchFilters? Filters { get; init; }
    [JsonPropertyName("groupByCity")] public bool? GroupByCity { get; init; }
}

public record CityGroup
{
    [JsonPropertyName("city")] public string City { get; init; } = string.Empty;
    [JsonPropertyName("count")] public int Count { get; init; }
    [JsonPropertyName("location")] public GeoPoint Location { get; init; } = new();
    [JsonPropertyName("previewImageUrl")] public string? PreviewImageUrl { get; init; }
}

public record MapSearchResponse
{
    [JsonPropertyName("hits")] public List<ExperienceSearchResult> Hits { get; init; } = new();
    [JsonPropertyName("cityGroups")] public List<CityGroup>? CityGroups { get; init; }
    [JsonPropertyName("found")] public int Found { get; init; }
    [JsonPropertyName("facets")] public Dictionary<string, List<FacetValue>>? Facets { get; init; }
}

#endregion

#region Facet config

/// <summary>
/// Admin-configured facet definition (mirrors <c>FacetConfigItem</c> from
/// <c>utilities/getSettings.ts</c>). Drives the mobile filter UI and the
/// server-side filter builder's AND/OR mode.
/// </summary>
public record FacetConfigItem
{
    [JsonPropertyName("facetKey")] public string FacetKey { get; init; } = string.Empty;
    /// <summary>
    /// Typesense field name this facet maps to (e.g. <c>city</c> → <c>city.name</c>).
    /// Comes straight from Payload so mobile clients don't need to
    /// duplicate the key-to-field mapping.
    /// </summary>
    [JsonPropertyName("tsField")] public string TsField { get; init; } = string.Empty;
    [JsonPropertyName("enabled")] public bool Enabled { get; init; }
    [JsonPropertyName("defaultExpanded")] public bool DefaultExpanded { get; init; }
    [JsonPropertyName("maxVisible")] public int? MaxVisible { get; init; }
    [JsonPropertyName("sortOrder")] public int SortOrder { get; init; }
    [JsonPropertyName("selectionMode")] public string SelectionMode { get; init; } = "multi";
    [JsonPropertyName("filterMode")] public string FilterMode { get; init; } = "or";
}

#endregion
