"use server";

export async function fetchYoutubeVideoDuration(url: string) {
  try {
    let videoId = "";
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname === "youtu.be") {
        videoId = urlObj.pathname.slice(1);
      } else if (urlObj.hostname.includes("youtube.com")) {
        videoId = urlObj.searchParams.get("v") || "";
      }
    } catch (e) {
      return { error: "Invalid YouTube URL format" };
    }

    if (!videoId) {
      return { error: "Could not extract video ID from URL" };
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return { error: "YouTube API key not configured on server" };
    }

    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${apiKey}`;
    const res = await fetch(apiUrl);
    
    if (!res.ok) {
      return { error: "Failed to fetch from YouTube API" };
    }

    const data = await res.json();
    if (!data.items || data.items.length === 0) {
      return { error: "Video not found, deleted, or private" };
    }

    const durationIso = data.items[0].contentDetails?.duration;
    if (!durationIso) {
      return { error: "No duration available for this video" };
    }

    // Parse ISO 8601 duration (e.g. PT15M33S)
    const match = durationIso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) {
      return { error: "Could not parse duration format" };
    }

    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseInt(match[3]) || 0;

    const totalMinutes = Math.round((hours * 60) + minutes + (seconds / 60));

    return { duration: totalMinutes };
  } catch (error) {
    return { error: "Failed to fetch duration" };
  }
}
