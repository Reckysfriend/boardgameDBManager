import { PlayersIcon, ProgressIcon, RecordsIcon, ComponentsIcon, StatsIcon } from "./symbols/CategorySymbols.jsx";

const categories = {
  players: {
    Icon: PlayersIcon,
    edge: "border-t-players",
    tint: "from-players/10",
    text: "text-players",
  },
  progress: {
    Icon: ProgressIcon,
    edge: "border-t-progress",
    tint: "from-progress/10",
    text: "text-progress",
  },
  records: {
    Icon: RecordsIcon,
    edge: "border-t-records",
    tint: "from-records/10",
    text: "text-records",
  },
  components: {
    Icon: ComponentsIcon,
    edge: "border-t-components",
    tint: "from-components/10",
    text: "text-components",
  },
  stats: {
    Icon: StatsIcon,
    edge: "border-t-stats",
    tint: "from-stats/10",
    text: "text-stats",
  },
};

export default function CategoryBox({ category, title, children }) {
  const { Icon, edge, tint, text } = categories[category];

  return (
    <section className={`rounded-lg border-t-[3px] bg-card bg-linear-to-b to-transparent p-5 ring-1 ring-white/10 ${edge} ${tint}`}>
      <h2 className="flex items-center gap-2 text-sm font-semibold">
        <span className={text}>
          <Icon />
        </span>
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
