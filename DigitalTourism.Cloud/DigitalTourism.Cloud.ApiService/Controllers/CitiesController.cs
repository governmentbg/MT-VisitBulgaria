using DigitalTourism.Cloud.ApiService.Models;
using DigitalTourism.Cloud.ApiService.Services;
using Microsoft.AspNetCore.Mvc;

namespace DigitalTourism.Cloud.ApiService.Controllers;

[ApiController]
[Route("v1/cities")]
public class CitiesController(PayloadCmsService payloadCms, ILogger<CitiesController> logger) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(CityListResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCities(
        [FromQuery] string? locale = "en",
        CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Getting cities: locale={Locale}", locale);
        var response = await payloadCms.GetCitiesAsync(locale: locale, cancellationToken: cancellationToken);

        var cities = response.Docs
            .Where(c => c.Coordinates?.Latitude is not null && c.Coordinates?.Longitude is not null)
            .Select(MapToCity)
            .ToList();

        return Ok(new CityListResponse { Data = cities });
    }

    private static CityItem MapToCity(PayloadCityDocument src) => new()
    {
        Id = src.Id,
        Name = src.Name,
        Latitude = src.Coordinates?.Latitude,
        Longitude = src.Coordinates?.Longitude,
        HeroImageUrl = src.HeroImage?.Url,
        Population = src.Population,
        IsCapital = src.IsCapital
    };
}

#region City Response Models

public record CityListResponse
{
    public List<CityItem> Data { get; init; } = [];
}

public record CityItem
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public double? Latitude { get; init; }
    public double? Longitude { get; init; }
    public string? HeroImageUrl { get; init; }
    public int? Population { get; init; }
    public bool? IsCapital { get; init; }
}

#endregion
