using Microsoft.AspNetCore.Mvc;

namespace DigitalTourism.Cloud.ApiService.Controllers;

/// <summary>
/// Proxies media file requests to Payload CMS.
/// Payload CMS stores images at /api/media/file/{filename} — this controller
/// streams them through so clients don't need direct Payload access.
/// </summary>
[ApiController]
[Route("v1/media")]
public class MediaProxyController(
    IHttpClientFactory httpClientFactory) : ControllerBase
{
    [HttpGet("{**path}")]
    public async Task<IActionResult> ProxyMedia(
        string path,
        CancellationToken cancellationToken = default)
    {
        if (path.Contains("..") || path.Contains("//"))
            return BadRequest();

        using var client = httpClientFactory.CreateClient("PayloadCms");
        var response = await client.GetAsync($"/api/media/{path}", cancellationToken);

        if (!response.IsSuccessStatusCode)
            return StatusCode((int)response.StatusCode);

        var contentType = response.Content.Headers.ContentType?.ToString() ?? "application/octet-stream";
        var stream = await response.Content.ReadAsStreamAsync(cancellationToken);

        // Forward cache headers from Payload CMS
        if (response.Headers.CacheControl is not null)
            Response.Headers.CacheControl = response.Headers.CacheControl.ToString();

        return File(stream, contentType);
    }
}
