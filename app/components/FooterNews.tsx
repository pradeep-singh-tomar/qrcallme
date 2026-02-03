"use client";
import { useEffect, useState } from "react";

export default function FooterNews() {
  const [feeds, setFeeds] = useState<any[]>([]);
  const [status, setStatus] = useState("Loading news...");

  useEffect(() => {
    fetch("/api/rss")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFeeds(data.feeds);
        } else {
          setStatus("No RSS feeds configured.");
        }
      })
      .catch(() => setStatus("RSS failed"));
  }, []);

  if (!feeds.length) {
    return <p className="text-slate-600 text-xs italic">{status}</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {feeds.map((feed, feedIdx) => (
        <div key={feedIdx} className="space-y-4">
          <h4 className="text-white font-black uppercase tracking-widest text-[10px]">
            {feed.name}
          </h4>

          {feed.items.map((item: any, idx: number) => (
            <a
              key={idx}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-3 items-start group"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 object-cover rounded"
                />
              )}

              <div>
                <p className="text-slate-400 text-xs font-bold group-hover:text-blue-400 line-clamp-2">
                  {item.title}
                </p>
                <span className="text-[9px] text-slate-600">
                  {item.pubDate
                    ? new Date(item.pubDate).toLocaleDateString()
                    : "Recent"}
                </span>
              </div>
            </a>
          ))}
        </div>
      ))}
    </div>
  );
}
