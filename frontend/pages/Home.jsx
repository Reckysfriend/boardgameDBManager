import Button from "../components/Button.jsx";
import CampaignCard from "../components/CampaignCard.jsx";
import GameCard from "../components/GameCard.jsx";
import SessionRow from "../components/SessionRow.jsx";
import { activeCampaigns, games, recentSessions } from "./homeSampleData.js";

export default function Home() {
  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-xl font-semibold">Continue playing</h2>
        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
          {activeCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-xl font-semibold">Games</h2>
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
          <button
            type="button"
            className="flex min-h-40 items-center justify-center rounded-lg border-2 border-dashed border-white/20 text-sm text-text/70 hover:border-action hover:text-action"
          >
            + Add game
          </button>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-semibold">Recent sessions</h2>
        <ul className="mt-4 divide-y divide-white/10 rounded-lg bg-card px-5 ring-1 ring-white/10">
          {recentSessions.map((session) => (
            <SessionRow key={session.id} session={session} />
          ))}
        </ul>
        <div className="mt-4">
          <Button to="/history">View all sessions</Button>
        </div>
      </section>
    </div>
  );
}
