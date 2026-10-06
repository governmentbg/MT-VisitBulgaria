using DigitalTourism.Cloud.ApiService.Models;
using DigitalTourism.Cloud.ApiService.Services;
using Microsoft.AspNetCore.Mvc;

namespace DigitalTourism.Cloud.ApiService.Controllers;

[ApiController]
[Route("v1/settings")]
public class SettingsController(
    PayloadCmsService payloadCms,
    ILogger<SettingsController> logger) : ControllerBase
{
    /// <summary>
    /// Returns the web paths of the legal pages configured in the Payload
    /// `settings` global for the given locale. The mobile app (or any other
    /// client) prepends its own web base URL and locale segment to build
    /// the full link that's opened in an external browser.
    ///
    /// The returned paths come from the page's breadcrumbs (the canonical
    /// path the Next.js frontend renders), falling back to `/{slug}` if
    /// no breadcrumbs are populated. Paths are locale-agnostic on purpose:
    /// callers are expected to render them under their own `/{locale}`
    /// prefix, mirroring what the web frontend does.
    /// </summary>
    [HttpGet("legal-pages")]
    [ProducesResponseType(typeof(LegalPagesResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetLegalPages(
        [FromQuery] string? locale = "en",
        CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Resolving legal pages for locale={Locale}", locale);

        var settings = await payloadCms.GetSettingsAsync(locale, cancellationToken);

        return Ok(new LegalPagesResponse
        {
            Locale = locale ?? "en",
            PrivacyPolicyPath = ResolvePagePath(settings?.PrivacyPolicyPage),
            TermsOfConditionsPath = ResolvePagePath(settings?.TermsOfConditionsPage),
        });
    }

    /// <summary>
    /// Returns the admin-configured facet definitions so the mobile filter
    /// UI can render facets dynamically (ordering, enabled state,
    /// <c>defaultExpanded</c>, <c>maxVisible</c>, <c>selectionMode</c>,
    /// <c>filterMode</c>). Backed by the same <c>getFacetConfig()</c>
    /// helper the Next.js frontend uses, so both clients stay in sync
    /// with the admin.
    /// </summary>
    [HttpGet("facet-config")]
    [ProducesResponseType(typeof(List<FacetConfigItem>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetFacetConfig(CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Fetching facet config");

        var config = await payloadCms.GetFacetConfigAsync(cancellationToken);
        if (config is null)
            return StatusCode(StatusCodes.Status502BadGateway, new { Error = "Facet config unavailable" });

        return Ok(config);
    }

    private static string? ResolvePagePath(PayloadPageReference? page)
    {
        if (page is null) return null;

        // Prefer breadcrumbs so nested pages resolve correctly (e.g. /legal/privacy).
        var lastCrumb = page.Breadcrumbs?.LastOrDefault();
        if (!string.IsNullOrWhiteSpace(lastCrumb?.Url))
        {
            return lastCrumb!.Url!.StartsWith('/') ? lastCrumb.Url : $"/{lastCrumb.Url}";
        }

        if (!string.IsNullOrWhiteSpace(page.Slug))
        {
            return $"/{page.Slug}";
        }

        return null;
    }
}

public record LegalPagesResponse
{
    public string Locale { get; init; } = "en";
    public string? PrivacyPolicyPath { get; init; }
    public string? TermsOfConditionsPath { get; init; }
}
