import { NextResponse } from "next/server";
import { detectPlatform, extractTikTokVideoId, getEmbedUrl } from "@/lib/embed";

const FETCH_TIMEOUT_MS = 8000;

async function fetchWithTimeout(url: string, init?: RequestInit) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

interface Preview {
  platform: string;
  title: string | null;
  authorHandle: string | null;
  thumbnailUrl: string | null;
  embedUrl: string | null;
}

async function previewTikTok(url: string): Promise<Preview> {
  const preview: Preview = { platform: "TIKTOK", title: null, authorHandle: null, thumbnailUrl: null, embedUrl: null };

  try {
    const res = await fetchWithTimeout(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`);
    if (res.ok) {
      const data = await res.json();
      preview.title = data.title ?? null;
      preview.authorHandle = data.author_name ? `@${data.author_name}` : null;
      preview.thumbnailUrl = data.thumbnail_url ?? null;

      const videoId =
        data.embed_product_id || (typeof data.html === "string" ? data.html.match(/data-video-id="(\d+)"/)?.[1] : null);
      preview.embedUrl = getEmbedUrl("TIKTOK", url, videoId || extractTikTokVideoId(url));
    } else {
      preview.embedUrl = getEmbedUrl("TIKTOK", url);
    }
  } catch {
    preview.embedUrl = getEmbedUrl("TIKTOK", url);
  }

  return preview;
}

async function previewInstagram(url: string): Promise<Preview> {
  const preview: Preview = { platform: "INSTAGRAM", title: null, authorHandle: null, thumbnailUrl: null, embedUrl: null };
  preview.embedUrl = getEmbedUrl("INSTAGRAM", url);

  // Instagram's oEmbed API requires an authenticated app token, so we try a
  // best-effort scrape of public Open Graph metadata and silently fall back
  // to the embed player alone if it's unreachable or blocked.
  try {
    const res = await fetchWithTimeout(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; ReelScoutBot/1.0)" },
    });
    if (res.ok) {
      const html = await res.text();
      preview.title = html.match(/<meta property="og:title" content="([^"]*)"/)?.[1] ?? null;
      preview.thumbnailUrl = html.match(/<meta property="og:image" content="([^"]*)"/)?.[1] ?? null;
    }
  } catch {
    // ignore — the embed iframe alone is enough to render a preview
  }

  return preview;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url")?.trim();

  if (!url) {
    return NextResponse.json({ error: "Falta el parámetro url" }, { status: 400 });
  }

  const platform = detectPlatform(url);

  if (platform === "TIKTOK") {
    return NextResponse.json(await previewTikTok(url));
  }

  if (platform === "INSTAGRAM") {
    return NextResponse.json(await previewInstagram(url));
  }

  return NextResponse.json({
    platform: "OTHER",
    title: null,
    authorHandle: null,
    thumbnailUrl: null,
    embedUrl: null,
  } satisfies Preview);
}
