import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/pdf-download?url=<encoded-pdf-url>&filename=<encoded-lecture-title>
 *
 * Proxies a PDF from Supabase Storage and forces the browser to download it
 * with the given filename instead of the default UUID-based storage filename.
 *
 * The `download` attribute on <a> tags is intentionally ignored by browsers
 * for cross-origin URLs, so this server-side proxy is required to control
 * the Content-Disposition filename.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const pdfUrl = searchParams.get("url");
  const rawFilename = searchParams.get("filename");

  // Validate that a URL was provided
  if (!pdfUrl) {
    return new NextResponse("Missing 'url' query parameter", { status: 400 });
  }

  // Sanitize the filename: strip characters that are illegal in filenames
  // across Windows, macOS, and Linux (<>:"/\|?*  and control chars).
  const sanitize = (name: string) =>
    name.replace(/[<>:"/\\|?*\x00-\x1f]/g, "").trim();

  const baseFilename = rawFilename
    ? sanitize(rawFilename)
    : // Fall back to the last path segment of the Supabase URL (the UUID filename)
      decodeURIComponent(pdfUrl.split("/").pop() ?? "lecture") || "lecture";

  const filename = baseFilename.endsWith(".pdf")
    ? baseFilename
    : `${baseFilename}.pdf`;

  // Fetch the PDF from Supabase Storage
  let pdfResponse: Response;
  try {
    pdfResponse = await fetch(pdfUrl);
  } catch {
    return new NextResponse("Failed to fetch PDF", { status: 502 });
  }

  if (!pdfResponse.ok) {
    return new NextResponse("PDF not found or inaccessible", {
      status: pdfResponse.status,
    });
  }

  const pdfBuffer = await pdfResponse.arrayBuffer();

  // Encode the filename for the Content-Disposition header.
  // RFC 5987 / RFC 8187: use filename* with UTF-8 percent-encoding so that
  // titles with spaces, accented letters, etc. download correctly in all browsers.
  const encodedFilename = encodeURIComponent(filename);

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      // `filename` is the ASCII fallback; `filename*` is the RFC 5987 form that
      // supports Unicode (spaces, accents, etc.).
      "Content-Disposition": `attachment; filename="${filename}"; filename*=UTF-8''${encodedFilename}`,
      // Short-lived cache to avoid hammering Supabase on repeated downloads.
      "Cache-Control": "private, max-age=60",
    },
  });
}
