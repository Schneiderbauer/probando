import type { Platform } from "@/types";

export function detectPlatform(url: string): Platform {
  const u = url.toLowerCase();
  if (u.includes("tiktok.com")) return "TIKTOK";
  if (u.includes("instagram.com")) return "INSTAGRAM";
  return "OTHER";
}

export function extractTikTokVideoId(url: string): string | null {
  const match = url.match(/\/video\/(\d+)/);
  return match ? match[1] : null;
}

export function extractInstagramShortcode(url: string): { type: string; code: string } | null {
  const match = url.match(/instagram\.com\/(p|reel|reels|tv)\/([^/?#]+)/i);
  if (!match) return null;
  const type = match[1] === "reels" ? "reel" : match[1];
  return { type, code: match[2] };
}

/**
 * Best-effort embed URL for an iframe player. Returns null when the
 * platform/link doesn't support a known embeddable format.
 */
export function getEmbedUrl(platform: Platform, url: string | null, tiktokVideoId?: string | null): string | null {
  if (!url) return null;

  if (platform === "TIKTOK") {
    const videoId = tiktokVideoId || extractTikTokVideoId(url);
    return videoId ? `https://www.tiktok.com/embed/v2/${videoId}` : null;
  }

  if (platform === "INSTAGRAM") {
    const parsed = extractInstagramShortcode(url);
    return parsed ? `https://www.instagram.com/${parsed.type}/${parsed.code}/embed` : null;
  }

  return null;
}
