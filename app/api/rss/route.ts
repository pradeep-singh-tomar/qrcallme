export const runtime = "nodejs";

import Parser from "rss-parser";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const parser = new Parser({
  customFields: {
    item: ["media:content", "media:thumbnail", "enclosure", "content:encoded", "description"],
  },
});

export async function GET() {
  try {
    const { data: feeds } = await supabase
      .from("rss_feeds")
      .select("id, name, url")
      .order("created_at", { ascending: true });

    if (!feeds || feeds.length === 0) {
      return Response.json({ success: false });
    }

    const results = [];

    for (const feedRow of feeds) {
      const res = await fetch(feedRow.url);
      const xml = await res.text();
      const feed = await parser.parseString(xml);

      const items = feed.items.slice(0, 3).map((item: any) => {
        let image = null;

        if (item["media:thumbnail"]?.$?.url) image = item["media:thumbnail"].$.url;
        else if (item["media:content"]?.$?.url) image = item["media:content"].$.url;
        else if (item.enclosure?.url) image = item.enclosure.url;
        else if (item["content:encoded"]) {
          const m = item["content:encoded"].match(/<img.*?src=["'](.*?)["']/);
          if (m) image = m[1];
        } else if (item.description) {
          const m = item.description.match(/<img.*?src=["'](.*?)["']/);
          if (m) image = m[1];
        }

        return {
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          image,
        };
      });

      results.push({
        name: feedRow.name || "News",
        items,
      });
    }

    return Response.json({ success: true, feeds: results });
  } catch (err) {
    console.error("RSS API error:", err);
    return Response.json({ success: false }, { status: 500 });
  }
}
