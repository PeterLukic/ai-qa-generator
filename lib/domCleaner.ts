export function cleanDom(html: string): string {
  let cleaned = html;

  // Remove script blocks
  cleaned = cleaned.replace(
    /<script\b[^>]*>[\s\S]*?<\/script>/gi,
    ""
  );

  // Remove style blocks
  cleaned = cleaned.replace(
    /<style\b[^>]*>[\s\S]*?<\/style>/gi,
    ""
  );

  // Remove SVG blocks
  cleaned = cleaned.replace(
    /<svg\b[^>]*>[\s\S]*?<\/svg>/gi,
    ""
  );

  // Remove hidden inputs (tokens etc.)
  cleaned = cleaned.replace(
    /<input\b[^>]*type=["']hidden["'][^>]*>/gi,
    ""
  );

  // Remove HTML comments
  cleaned = cleaned.replace(
    /<!--[\s\S]*?-->/g,
    ""
  );

  // Remove unnecessary whitespace
  cleaned = cleaned.replace(/\s+/g, " ").trim();

  return cleaned;
}