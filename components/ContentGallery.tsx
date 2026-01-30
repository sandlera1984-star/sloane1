"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";

interface ContentItem {
  id: string;
  title: string;
  type: "photo" | "video";
  mediaUrl: string;
  thumbnailUrl: string;
  isLocked: boolean;
}

interface ContentGalleryProps {
  items: ContentItem[];
  canViewLocked: boolean;
}

export default function ContentGallery({ items, canViewLocked }: ContentGalleryProps) {
  const [typeFilter, setTypeFilter] = useState<"all" | "photo" | "video">("all");
  const [accessFilter, setAccessFilter] = useState<"all" | "free" | "members">("all");

  const filtered = items.filter((item) => {
    if (typeFilter !== "all" && item.type !== typeFilter) return false;
    if (accessFilter === "free" && item.isLocked) return false;
    if (accessFilter === "members" && !item.isLocked) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {[
          { key: "all", label: "All" },
          { key: "photo", label: "Photos" },
          { key: "video", label: "Videos" }
        ].map((option) => (
          <button
            key={option.key}
            onClick={() => setTypeFilter(option.key as typeof typeFilter)}
            className={clsx(
              "rounded-full border px-4 py-2 text-sm",
              typeFilter === option.key ? "border-plum bg-plum text-white" : "border-rose/30 text-plum"
            )}
          >
            {option.label}
          </button>
        ))}
        {[
          { key: "all", label: "All" },
          { key: "free", label: "Free" },
          { key: "members", label: "Members" }
        ].map((option) => (
          <button
            key={option.key}
            onClick={() => setAccessFilter(option.key as typeof accessFilter)}
            className={clsx(
              "rounded-full border px-4 py-2 text-sm",
              accessFilter === option.key ? "border-plum bg-plum text-white" : "border-rose/30 text-plum"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <div key={item.id} className="rounded-2xl border border-rose/20 bg-white p-3 shadow-sm">
            <div className="relative h-48 overflow-hidden rounded-xl">
              {item.type === "photo" && (
                <Image
                  src={canViewLocked || !item.isLocked ? item.mediaUrl : item.thumbnailUrl}
                  alt={item.title}
                  fill
                  className={clsx("object-cover", !canViewLocked && item.isLocked && "blur-cover")}
                />
              )}
              {item.type === "video" && (canViewLocked || !item.isLocked) && (
                <video
                  src={item.mediaUrl}
                  controls
                  className="h-full w-full object-cover"
                />
              )}
              {item.type === "video" && !canViewLocked && item.isLocked && (
                <Image
                  src={item.thumbnailUrl}
                  alt={item.title}
                  fill
                  className={clsx("object-cover", "blur-cover")}
                />
              )}
              {!canViewLocked && item.isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-plum/40 text-white">
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest">
                    Locked
                  </span>
                </div>
              )}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-plum">{item.title}</p>
              <span className="text-xs uppercase tracking-widest text-plum/60">
                {item.isLocked ? "Members" : "Free"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
