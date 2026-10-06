using System.Text.Json;
using DigitalTourism.Cloud.ApiService.Models;

namespace DigitalTourism.Cloud.ApiService.Controllers;

/// <summary>
/// Shared mapping helpers for all experience controllers.
/// Converts Payload CMS types to API response DTOs.
/// </summary>
public static class ExperienceMapper
{
    public static CategorySummary? MapCategory(PayloadCategory? cat)
    {
        if (cat is null) return null;
        return new CategorySummary { Id = cat.Id, Title = cat.Title, Slug = cat.Slug };
    }

    public static LocationInfo? MapLocation(PayloadLocation? loc)
    {
        if (loc is null) return null;
        return new LocationInfo
        {
            Address = loc.Address,
            Latitude = loc.Coordinates?.Latitude,
            Longitude = loc.Coordinates?.Longitude
        };
    }

    public static ContactInfo? MapContact(PayloadContact? contact)
    {
        if (contact is null) return null;
        return new ContactInfo
        {
            Phone = contact.Phone,
            Email = contact.Email,
            Website = contact.Website
        };
    }

    public static List<ImageInfo> MapImages(PayloadMedia? heroImage, List<PayloadMedia>? gallery)
    {
        var images = new List<ImageInfo>();
        if (heroImage is not null)
        {
            images.Add(new ImageInfo { Url = heroImage.Url, Alt = heroImage.Alt, Width = heroImage.Width, Height = heroImage.Height });
        }
        if (gallery is not null)
        {
            images.AddRange(gallery.Select(m => new ImageInfo { Url = m.Url, Alt = m.Alt, Width = m.Width, Height = m.Height }));
        }
        return images;
    }

    public static List<CategoryInfo>? MapCategories(List<PayloadCategory>? cats)
    {
        return cats?.Select(c => new CategoryInfo { Id = c.Id, Title = c.Title, Slug = c.Slug }).ToList();
    }

    public static List<TagInfo>? MapTags(List<PayloadTag>? tags)
    {
        return tags?.Select(t => new TagInfo { Id = t.Id, Title = t.DisplayName, Slug = t.Slug }).ToList();
    }

    public static List<VideoInfo>? MapVideos(List<PayloadVideo>? videos)
    {
        return videos?.Select(v => new VideoInfo { Title = v.Title, Url = v.Url }).ToList();
    }

    public static List<BrochureInfo>? MapBrochures(List<PayloadBrochure>? brochures)
    {
        return brochures?.Select(b => new BrochureInfo { Title = b.Title, Url = b.File?.Url, Filename = b.File?.Filename }).ToList();
    }

    public static List<TaxonomyItemInfo>? MapTaxonomyItems(List<PayloadTag>? items)
    {
        return items?.Select(t => new TaxonomyItemInfo { Id = t.Id, Name = t.DisplayName, Icon = t.Icon }).ToList();
    }

    public static TaxonomyItemInfo? MapTaxonomyItem(PayloadTag? item)
    {
        if (item is null) return null;
        return new TaxonomyItemInfo { Id = item.Id, Name = item.DisplayName, Icon = item.Icon };
    }

    /// <summary>
    /// Extract municipality name from JsonElement (handles both populated object and raw ID).
    /// At depth=1, city is populated but municipality may still be a number.
    /// </summary>
    public static string? GetMunicipalityName(JsonElement? municipality)
    {
        if (municipality is not { ValueKind: JsonValueKind.Object } el) return null;
        return el.TryGetProperty("name", out var name) ? name.GetString() : null;
    }
}

#region Shared Response Types

public record CategorySummary
{
    public int Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string? Slug { get; init; }
}

public record CategoryInfo
{
    public int Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string? Slug { get; init; }
}

public record TagInfo
{
    public int Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string? Slug { get; init; }
}

public record LocationInfo
{
    public string? Address { get; init; }
    public double? Latitude { get; init; }
    public double? Longitude { get; init; }
}

public record ContactInfo
{
    public string? Phone { get; init; }
    public string? Email { get; init; }
    public string? Website { get; init; }
}

public record ImageInfo
{
    public string? Url { get; init; }
    public string? Alt { get; init; }
    public int? Width { get; init; }
    public int? Height { get; init; }
}

public record VideoInfo
{
    public string? Title { get; init; }
    public string Url { get; init; } = string.Empty;
}

public record BrochureInfo
{
    public string? Title { get; init; }
    public string? Url { get; init; }
    public string? Filename { get; init; }
}

public record TaxonomyItemInfo
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? Icon { get; init; }
}

public record PeriodInfo
{
    public DateTime? StartDate { get; init; }
    public DateTime? EndDate { get; init; }
}

#endregion
