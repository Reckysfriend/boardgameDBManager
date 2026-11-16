import Button from "./Button.jsx";

export default function CampaignCard({ campaign }) {
  const { game, name, completed, total, next, lastPlayed } = campaign;
  const percent = (completed / total) * 100;

  return (
    <article className="rounded-lg bg-card p-5 ring-1 ring-white/10">
      <p className="text-sm text-text/70">{game}</p>
      <h3 className="mt-1 text-lg font-semibold">{name}</h3>
      <div className="mt-4 h-2 rounded-full bg-white/10" aria-hidden="true">
        <div className="h-2 rounded-full bg-progress" style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-2 text-sm text-text/70">
        {completed} of {total} scenarios
      </p>
      <p className="mt-4 text-sm">Up next: {next}</p>
      <p className="text-sm text-text/70">Last played {lastPlayed}</p>
      <div className="mt-4">
        <Button>Open campaign</Button>
      </div>
    </article>
  );
}
