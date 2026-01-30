import Image from "next/image";
import clsx from "clsx";

interface ContentCardProps {
  title: string;
  thumbnailUrl: string;
  isLocked: boolean;
  canView: boolean;
}

export default function ContentCard({ title, thumbnailUrl, isLocked, canView }: ContentCardProps) {
  const shouldBlur = isLocked && !canView;
  return (
    <div className="relative overflow-hidden rounded-2xl border border-rose/20 bg-white shadow-sm">
      <div className={clsx("relative h-48 w-full", shouldBlur && "blur-cover")}
      >
        <Image src={thumbnailUrl} alt={title} fill className="object-cover" />
      </div>
      {shouldBlur && (
        <div className="absolute inset-0 flex items-center justify-center bg-plum/40 text-white">
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest">
            Locked
          </span>
        </div>
      )}
      <div className="px-4 py-3">
        <p className="text-sm font-semibold text-plum">{title}</p>
      </div>
    </div>
  );
}
