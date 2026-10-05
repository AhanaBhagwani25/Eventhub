import { useState } from "react";
import type { ReactNode } from "react";
import { Briefcase, Cpu, Music, Palette, PartyPopper, Trophy, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Each category gets: a rich multi-stop gradient, a glow color, an icon,
// and its own piece of SVG artwork. Everything is inline, so there are no
// image files to load and it looks sharp at any size (and in dark mode).

type Theme = {
  from: string;
  via: string;
  to: string;
  glow: string;
  Icon: LucideIcon;
};

export const CATEGORY_THEMES: Record<string, Theme> = {
  Tech: { from: "#0F172A", via: "#312E81", to: "#0EA5E9", glow: "#38BDF8", Icon: Cpu },
  Music: { from: "#3B0764", via: "#A21CAF", to: "#FB7185", glow: "#F0ABFC", Icon: Music },
  Sports: { from: "#064E3B", via: "#059669", to: "#A3E635", glow: "#BEF264", Icon: Trophy },
  Workshop: { from: "#7C2D12", via: "#EA580C", to: "#FACC15", glow: "#FDE68A", Icon: Wrench },
  Arts: { from: "#9F1239", via: "#F43F5E", to: "#FDBA74", glow: "#FECDD3", Icon: Palette },
  Career: { from: "#0F2A4A", via: "#1D4ED8", to: "#2DD4BF", glow: "#99F6E4", Icon: Briefcase },
  Social: { from: "#4C1D95", via: "#7C3AED", to: "#F472B6", glow: "#FBCFE8", Icon: PartyPopper },
};

const FALLBACK = "Tech";

export function categoryTheme(category: string): Theme {
  return CATEGORY_THEMES[category] ?? CATEGORY_THEMES[FALLBACK];
}

// Artwork is drawn on a 800x320 canvas and scaled with "slice" so it always fills the banner.
function Art({ category }: { category: string }): ReactNode {
  switch (category) {
    case "Tech":
      return (
        <g fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round">
          <g strokeOpacity="0.28" strokeWidth="2">
            <path d="M0 60h180l40 40h160l30-30h120" />
            <path d="M0 140h120l50 50h200" />
            <path d="M420 190h140l40 40h200" />
            <path d="M520 40h120l40 40h120" />
            <path d="M80 260h200l40-40h120" />
            <path d="M560 300h240" />
          </g>
          <g fill="#fff" fillOpacity="0.7" stroke="none">
            <circle cx="180" cy="60" r="5" />
            <circle cx="380" cy="100" r="5" />
            <circle cx="170" cy="190" r="5" />
            <circle cx="600" cy="230" r="5" />
            <circle cx="640" cy="80" r="5" />
            <circle cx="320" cy="220" r="5" />
          </g>
          <g strokeOpacity="0.5" strokeWidth="6">
            <path d="M610 120l-34 34 34 34" />
            <path d="M690 120l34 34-34 34" />
            <path d="M664 106l-28 96" />
          </g>
        </g>
      );
    case "Music":
      return (
        <g>
          <g fill="#fff">
            {Array.from({ length: 28 }).map((_, i) => {
              const h = 30 + Math.abs(Math.sin(i * 0.9) * 110) + (i % 3) * 14;
              return (
                <rect
                  key={i}
                  x={20 + i * 28}
                  y={320 - h}
                  width="12"
                  height={h}
                  rx="6"
                  opacity={0.16 + (i % 4) * 0.06}
                />
              );
            })}
          </g>
          <g fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="2">
            <circle cx="640" cy="110" r="46" />
            <circle cx="640" cy="110" r="78" />
            <circle cx="640" cy="110" r="110" />
          </g>
          <g fill="#fff" fillOpacity="0.55">
            <circle cx="150" cy="80" r="14" />
            <rect x="160" y="30" width="5" height="52" rx="2" />
            <circle cx="260" cy="120" r="11" />
            <rect x="268" y="78" width="5" height="44" rx="2" />
          </g>
        </g>
      );
    case "Sports":
      return (
        <g fill="none" stroke="#fff" strokeLinecap="round">
          <g strokeOpacity="0.3" strokeWidth="3">
            <circle cx="400" cy="160" r="90" />
            <path d="M400 0v320" />
            <rect x="-4" y="90" width="110" height="140" />
            <rect x="694" y="90" width="110" height="140" />
          </g>
          <g strokeOpacity="0.5" strokeWidth="4">
            <path d="M560 40a110 110 0 0 1 150 70" />
            <path d="M590 20a140 140 0 0 1 190 90" />
          </g>
          <g transform="translate(640 210)">
            <circle r="52" fill="#fff" fillOpacity="0.22" stroke="#fff" strokeOpacity="0.7" strokeWidth="4" />
            <path d="M0 -18l17 12-6 20h-22l-6-20z" fill="#fff" fillOpacity="0.55" stroke="none" />
            <path d="M0 -18V-50M17 -6l32-10M11 14l22 26M-11 14l-22 26M-17 -6l-32-10" strokeOpacity="0.6" strokeWidth="3" />
          </g>
        </g>
      );
    case "Workshop":
      return (
        <g fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round">
          <g transform="translate(600 120)" strokeOpacity="0.45" strokeWidth="6">
            <circle r="34" />
            <circle r="62" strokeDasharray="14 12" strokeWidth="18" strokeOpacity="0.4" />
          </g>
          <g transform="translate(720 250)" strokeOpacity="0.3" strokeWidth="5">
            <circle r="24" />
            <circle r="46" strokeDasharray="10 9" strokeWidth="14" strokeOpacity="0.4" />
          </g>
          <g transform="translate(130 240)" strokeOpacity="0.25" strokeWidth="5">
            <circle r="30" />
            <circle r="56" strokeDasharray="12 10" strokeWidth="16" strokeOpacity="0.4" />
          </g>
          <g strokeOpacity="0.2" strokeWidth="2">
            {Array.from({ length: 9 }).map((_, i) => (
              <path key={i} d={`M${i * 100} 0v320`} />
            ))}
            {Array.from({ length: 4 }).map((_, i) => (
              <path key={i} d={`M0 ${i * 100}h800`} />
            ))}
          </g>
          <g fill="#fff" fillOpacity="0.5" stroke="none">
            <rect x="300" y="60" width="90" height="12" rx="6" transform="rotate(-25 345 66)" />
            <rect x="330" y="110" width="60" height="12" rx="6" transform="rotate(-25 360 116)" />
          </g>
        </g>
      );
    case "Arts":
      return (
        <g>
          <g fill="#fff">
            <circle cx="140" cy="90" r="80" opacity="0.14" />
            <circle cx="230" cy="190" r="56" opacity="0.18" />
            <circle cx="620" cy="80" r="64" opacity="0.16" />
            <circle cx="720" cy="220" r="90" opacity="0.14" />
            <circle cx="470" cy="250" r="40" opacity="0.2" />
          </g>
          <g fill="none" stroke="#fff" strokeLinecap="round">
            <path d="M-10 250C120 170 200 310 330 230S520 150 640 210 760 250 820 190" strokeOpacity="0.55" strokeWidth="14" />
            <path d="M-10 290C130 230 220 340 350 270S540 200 660 260 760 290 820 240" strokeOpacity="0.3" strokeWidth="8" />
            <path d="M300 60c40-30 80 30 120 0s70-20 100 0" strokeOpacity="0.4" strokeWidth="6" />
          </g>
          <g fill="#fff" fillOpacity="0.6">
            <circle cx="380" cy="140" r="6" />
            <circle cx="560" cy="170" r="4" />
            <circle cx="90" cy="230" r="5" />
          </g>
        </g>
      );
    case "Career":
      return (
        <g>
          <g fill="#fff">
            {[60, 100, 150, 210, 280].map((h, i) => (
              <rect key={i} x={470 + i * 64} y={320 - h} width="40" height={h} rx="8" opacity={0.12 + i * 0.05} />
            ))}
          </g>
          <g fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round">
            <path d="M470 220L550 170L620 190L700 110L770 50" strokeOpacity="0.8" strokeWidth="5" />
            <path d="M745 48l25 2-4 25" strokeOpacity="0.8" strokeWidth="5" />
          </g>
          <g stroke="#fff" strokeOpacity="0.35" strokeWidth="2">
            <path d="M120 80L220 150M220 150L140 240M220 150L330 90M330 90L400 190M220 150L330 250M330 250L400 190" />
          </g>
          <g fill="#fff" fillOpacity="0.65">
            <circle cx="120" cy="80" r="9" />
            <circle cx="220" cy="150" r="13" />
            <circle cx="140" cy="240" r="9" />
            <circle cx="330" cy="90" r="9" />
            <circle cx="400" cy="190" r="11" />
            <circle cx="330" cy="250" r="8" />
          </g>
        </g>
      );
    case "Social":
    default:
      return (
        <g>
          <g fill="#fff">
            <circle cx="160" cy="130" r="90" opacity="0.13" />
            <circle cx="260" cy="170" r="70" opacity="0.13" />
            <circle cx="620" cy="110" r="100" opacity="0.12" />
            <circle cx="700" cy="210" r="64" opacity="0.14" />
          </g>
          <g>
            {[
              [60, 50, "#FDE047"], [200, 270, "#67E8F9"], [340, 60, "#FDA4AF"], [430, 250, "#FDE047"],
              [520, 40, "#A5F3FC"], [560, 280, "#FDA4AF"], [760, 70, "#FDE047"], [90, 190, "#A5F3FC"],
              [300, 160, "#FDE047"], [480, 150, "#FDA4AF"], [770, 280, "#67E8F9"],
            ].map(([x, y, c], i) => (
              <rect
                key={i}
                x={x as number}
                y={y as number}
                width={i % 2 ? 16 : 10}
                height={i % 2 ? 6 : 10}
                rx={i % 3 === 0 ? 5 : 2}
                fill={c as string}
                opacity="0.85"
                transform={`rotate(${i * 37} ${x} ${y})`}
              />
            ))}
          </g>
          <g fill="none" stroke="#fff" strokeOpacity="0.4" strokeWidth="3" strokeLinecap="round">
            <path d="M20 300c60-60 120-60 180 0" />
            <path d="M600 300c60-50 120-50 180 0" />
          </g>
        </g>
      );
  }
}

// A full-bleed banner: gradient + artwork + soft glow + big category icon.
// Fills whatever box the parent gives it (parent needs `relative` and a height).
export function CategoryArt({ category, className = "" }: { category: string; className?: string }) {
  const t = categoryTheme(category);
  const gid = `cat-${category.replace(/\W/g, "") || "x"}`;
  const Icon = t.Icon;

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 800 320"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id={`${gid}-bg`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={t.from} />
            <stop offset="0.55" stopColor={t.via} />
            <stop offset="1" stopColor={t.to} />
          </linearGradient>
          <radialGradient id={`${gid}-glow`} cx="0.82" cy="0.25" r="0.55">
            <stop offset="0" stopColor={t.glow} stopOpacity="0.75" />
            <stop offset="1" stopColor={t.glow} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${gid}-shade`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0.45" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.55" />
          </linearGradient>
        </defs>
        <rect width="800" height="320" fill={`url(#${gid}-bg)`} />
        <rect width="800" height="320" fill={`url(#${gid}-glow)`} />
        <Art category={category} />
        <rect width="800" height="320" fill={`url(#${gid}-shade)`} />
      </svg>
      <Icon
        className="absolute right-[7%] top-1/2 h-1/2 w-auto -translate-y-1/2 text-white/25 drop-shadow-[0_4px_24px_rgba(255,255,255,0.25)]"
        strokeWidth={1.25}
      />
    </div>
  );
}

// Small round badge shown over banners and on category chips.
export function CategoryBadge({ category, className = "" }: { category: string; className?: string }) {
  const Icon = categoryTheme(category).Icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm ${className}`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {category}
    </span>
  );
}

// The banner used on event cards and the details page.
// Uses the organizer's image when there is one (with a dark fade so text stays readable),
// and falls back to the category artwork if there is no image or it fails to load.
export function EventBanner({
  category,
  imageUrl,
  className = "",
  children,
}: {
  category: string;
  imageUrl?: string | null;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <EventBannerInner key={imageUrl ?? "none"} category={category} imageUrl={imageUrl} className={className}>
      {children}
    </EventBannerInner>
  );
}

function EventBannerInner({
  category,
  imageUrl,
  className,
  children,
}: {
  category: string;
  imageUrl?: string | null;
  className?: string;
  children?: ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(imageUrl) && !failed;

  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      {showImage ? (
        <>
          <img
            src={imageUrl!}
            alt=""
            loading="lazy"
            onError={() => setFailed(true)}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" aria-hidden="true" />
        </>
      ) : (
        <CategoryArt category={category} />
      )}
      {children}
    </div>
  );
}
