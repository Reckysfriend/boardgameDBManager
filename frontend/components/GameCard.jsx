import GameArt from "./GameArt.jsx";
import { gameColors } from "./gameColors.js";

export default function GameCard({ game }) {
  const { slug, name, plays, lastPlayed, activeCampaigns } = game;
  const { tint, text } = gameColors[slug];

  return (
    <article className="overflow-hidden rounded-lg bg-card ring-1 ring-white/10">
      <div className={`flex h-32 items-center justify-center ${tint} ${text}`}>
        <GameArt slug={slug} />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="mt-1 text-sm text-text/70">
          {plays} {plays === 1 ? "play" : "plays"}
        </p>
        <p className="text-sm text-text/70">Last played {lastPlayed}</p>
        {activeCampaigns > 0 && (
          <p className="text-sm text-text/70">
            {activeCampaigns} active {activeCampaigns === 1 ? "campaign" : "campaigns"}
          </p>
        )}
      </div>
    </article>
  );
}
